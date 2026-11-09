import Toast from 'react-native-toast-message';
import { IAccessToken } from '../../Authentication/DataTransferObjects/IAccessToken';
import { TokenStorageService } from '../../Authentication/Services/TokenStorageService';
import '../DataTransferObjects/Configuration/IRuntimeConfiguration';
import { resolveWebApiRestUrl } from '../Utilities/WebApiRestUrlResolver';

// `process.env.EXPO_PUBLIC_*` precisa ser acessado literalmente: o Expo substitui a expressão pelo valor no build.
export const WEB_SERVICE_REST_URL = resolveWebApiRestUrl(
  globalThis.__CORE_RUNTIME_CONFIG__?.WEB_API_REST_URL,
  process.env.EXPO_PUBLIC_WEB_API_REST_URL,
);

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
    this.name = 'SessionExpiredError';
  }
}

type TokenRefreshFunction = () => Promise<IAccessToken>;

type PendingRequest = {
  retryFn: () => Promise<Response>;
  resolve: (value: Response) => void;
  reject: (reason: unknown) => void;
};

let tokenRefreshFn: TokenRefreshFunction | null = null;
let isRefreshingToken = false;
let pendingRequests: PendingRequest[] = [];

export function setTokenRefreshFunction(fn: TokenRefreshFunction): void {
  tokenRefreshFn = fn;
}

function processPendingRequests(error: unknown): void {
  const requests = pendingRequests.splice(0);
  requests.forEach(({ retryFn, resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      retryFn().then(resolve).catch(reject);
    }
  });
}

const performNativeFetch = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init);

async function refreshAccessToken(): Promise<void> {
  if (!tokenRefreshFn) {
    throw new Error('No token refresh function registered. Call setTokenRefreshFunction() at startup.');
  }

  const newToken = await tokenRefreshFn();
  TokenStorageService.setToken(newToken);
  TokenStorageService.triggerTokenRefreshed(newToken);
}

async function handleUnauthorizedResponse(retryRequest: () => Promise<Response>): Promise<Response> {
  if (isRefreshingToken) {
    return new Promise<Response>((resolve, reject) => {
      pendingRequests.push({ retryFn: retryRequest, resolve, reject });
    });
  }

  isRefreshingToken = true;
  try {
    await refreshAccessToken();
    processPendingRequests(null);
    return retryRequest();
  } catch (error) {
    processPendingRequests(error);
    TokenStorageService.clearToken();
    TokenStorageService.triggerLogout();

    Toast.show({type: 'info', text1: 'Sua sessão expirou. Por favor, faça login novamente.'});
    throw new SessionExpiredError();
  } finally {
    isRefreshingToken = false;
  }
}

function injectAuthorizationHeader(request: RequestInit | undefined): Record<string, string> {
  const token = TokenStorageService.getToken();
  const existingHeaders = (request?.headers as Record<string, string>) ?? {};

  return {
    ...existingHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function performFetchWithAuth(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  isRetry: boolean,
): Promise<Response> {
  const headers = injectAuthorizationHeader(options);

  const response = await performNativeFetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (response.status === 401 && !isRetry) {
    return handleUnauthorizedResponse(() => performFetchWithAuth(url, options, true));
  }

  return response;
}

export async function fetchWithAuth(
  url: RequestInfo | URL,
  options?: RequestInit,
): Promise<Response> {
  return performFetchWithAuth(url, options, false);
}
