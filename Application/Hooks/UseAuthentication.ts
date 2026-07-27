import { useCallback, useEffect, useState } from 'react';
import { AuthenticationService } from '../Services/AuthenticationService';
import { TokenStorageService } from '../Services/TokenStorageService';
import { setTokenRefreshFunction } from '../Services/HttpClientService';
import { ConnectivityProbe } from '../Services/Offline/ConnectivityProbe';
import { OperationMode, OperationModeService } from '../Services/Offline/OperationModeService';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { IAccessToken } from '../Interfaces/DataTransferObjects/Authentication/IAccessToken';
import { ILoginRequest } from '../Interfaces/DataTransferObjects/Authentication/ILoginRequest';

const authenticationService = new AuthenticationService();
const connectivityProbe = new ConnectivityProbe();

/** Fire-and-forget so the UI never freezes waiting for synchronization. */
function startSynchronization(): void {
  void OfflineCompositionRoot.dataSynchronizationService.synchronize();
}

interface AuthenticationState {
  accessToken: IAccessToken | null;
  isLoading: boolean;
  isInitializing: boolean;
}

interface AuthenticationActions {
  login: (request: ILoginRequest) => Promise<void>;
}

export type UseAuthenticationResult = AuthenticationState & AuthenticationActions;

export function UseAuthentication(): UseAuthenticationResult {
  const [accessToken, setAccessToken] = useState<IAccessToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const storeToken = useCallback((token: IAccessToken) => {
    TokenStorageService.setToken(token);
    setAccessToken(token);
  }, []);

  useEffect(() => {
    // Inject the refresh function into the HTTP client to avoid a circular import
    // (AuthenticationService → APIConsumerService → HttpClient → AuthenticationService).
    setTokenRefreshFunction(() => authenticationService.refresh());

    // Keep React state in sync when the HTTP interceptor silently refreshes the token.
    TokenStorageService.registerTokenRefreshedCallback(setAccessToken);

    // Clear React state when the HTTP interceptor triggers logout after a failed refresh.
    TokenStorageService.registerLogoutCallback(() => setAccessToken(null));
  }, []);

  useEffect(() => {
    // The operation mode is resolved ONCE, at startup, and never re-evaluated
    // during the session (per the offline requirements).
    const bootstrap = async (): Promise<void> => {
      const operationMode = process.env.EXPO_PUBLIC_OPERATION_MODE;
      if (operationMode) {
        OperationModeService.resolve(operationMode as OperationMode);
      } else {
        const online = await connectivityProbe.isOnline();
        OperationModeService.resolve(online ? OperationMode.Online : OperationMode.Offline);
      }

      if (OperationModeService.getMode() === OperationMode.Online) {
        try {
          const token = await authenticationService.refresh();
          storeToken(token);
          startSynchronization();
        } catch {
          // Not authenticated: fall back to the login screen.
        }
      } else {
        // Offline: reuse the last known token so the app can open without a server.
        const storedToken = TokenStorageService.getFullToken();
        if (storedToken) {
          setAccessToken(storedToken);
        }
      }
    };

    bootstrap().finally(() => setIsInitializing(false));
  }, [storeToken]);

  const login = useCallback(async (request: ILoginRequest) => {
    setIsLoading(true);

    try 
    {
      const token = await authenticationService.login(request);
      storeToken(token);
      startSynchronization();
    }
    catch
    {
      // Error already shown by APIConsumerService
    }
    finally 
    {
      setIsLoading(false);
    }
  }, [storeToken]);

  return { accessToken, isLoading, isInitializing, login };
}
