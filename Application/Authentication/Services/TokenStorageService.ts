import { IAccessToken } from '../Interfaces/DataTransferObjects/Authentication/IAccessToken';

const TOKEN_KEY = 'core_access_token';

let _fullToken: IAccessToken | null = null;
let _logoutCallback: (() => void) | null = null;
let _tokenRefreshedCallback: ((token: IAccessToken) => void) | null = null;
let _isLoggingOut = false;

const _loadFromStorage = (): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (raw) {
        _fullToken = JSON.parse(raw) as IAccessToken;
      }
    }
  } catch {
    _fullToken = null;
  }
};

_loadFromStorage();

export const TokenStorageService = {
  /** Persists the full token object to memory and localStorage. */
  setToken: (token: IAccessToken | null): void => {
    _fullToken = token;
    _isLoggingOut = false;
    try {
      if (typeof localStorage !== 'undefined') {
        if (token) {
          localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch { /* storage unavailable */ }
  },

  /** Returns just the JWT string, used for Authorization headers. */
  getToken: (): string | null => _fullToken?.accessToken ?? null,

  /** Returns the full AccessToken object (includes userName, expiration, etc.). */
  getFullToken: (): IAccessToken | null => _fullToken,

  clearToken: (): void => {
    TokenStorageService.setToken(null);
  },

  registerLogoutCallback: (callback: () => void): void => {
    _logoutCallback = callback;
  },

  /**
   * Registers a callback invoked after a background token auto-refresh (via HTTP interceptor).
   * Used to keep React state in sync without requiring a full login.
   */
  registerTokenRefreshedCallback: (callback: (token: IAccessToken) => void): void => {
    _tokenRefreshedCallback = callback;
  },

  triggerLogout: (): void => {
    _isLoggingOut = true;
    _logoutCallback?.();
  },

  /** Called by the HTTP interceptor after a successful auto-refresh. */
  triggerTokenRefreshed: (token: IAccessToken): void => {
    _tokenRefreshedCallback?.(token);
  },

  isLoggingOut: (): boolean => _isLoggingOut,
};
