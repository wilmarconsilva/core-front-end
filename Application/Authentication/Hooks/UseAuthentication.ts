import { useCallback, useEffect, useState } from 'react';
import { AuthenticationService } from '../Services/AuthenticationService';
import { TokenStorageService } from '../Services/TokenStorageService';
import { setTokenRefreshFunction } from '../../Shared/Services/HttpClientService';
import { ConnectivityProbe } from '../../Offline/Services/ConnectivityProbe';
import { OperationMode, OperationModeService } from '../../Offline/Services/OperationModeService';
import { APIConsumerUtility } from '../../Shared/Utilities/APIConsumerUtility';
import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { IAccessToken } from '../DataTransferObjects/IAccessToken';
import { ILoginRequest } from '../DataTransferObjects/ILoginRequest';

const authenticationService = new AuthenticationService();
const connectivityProbe = new ConnectivityProbe();

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
  const { dataSynchronizationService } = UseApplicationServices();

  /** Fire-and-forget so the UI never freezes waiting for synchronization. */
  const startSynchronization = useCallback(() => {
    void dataSynchronizationService.synchronize();
  }, [dataSynchronizationService]);

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

  /** Offline: reuse the last known token so the app can open without a server. */
  const restoreStoredToken = useCallback(() => {
    const storedToken = TokenStorageService.getFullToken();
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // The operation mode is resolved ONCE, at startup, and never re-evaluated during the session
    // (per the offline requirements). It is resolved only AFTER the refresh attempt, because the
    // refresh is the strongest evidence available of whether the server is really reachable.
    const initialize = async (): Promise<void> => {
      const forcedMode = process.env.EXPO_PUBLIC_OPERATION_MODE as OperationMode | undefined;

      if (forcedMode === OperationMode.Offline) {
        OperationModeService.resolve(OperationMode.Offline);
        restoreStoredToken();
        return;
      }

      // Without an explicit mode, probe first to avoid a pointless refresh round trip.
      if (!forcedMode && !(await connectivityProbe.isOnline())) {
        OperationModeService.resolve(OperationMode.Offline);
        restoreStoredToken();
        return;
      }

      try {
        const token = await authenticationService.refresh();
        OperationModeService.resolve(OperationMode.Online);
        storeToken(token);
        startSynchronization();
      } catch (error) {
        // The server died between the probe and the refresh, or answered through a proxy whose
        // upstream is down. Degrade instead of logging the user out. A mode forced by the operator
        // is honoured literally and never degrades on its own.
        if (!forcedMode && APIConsumerUtility.ErrorIsServerUnreachable(error)) {
          OperationModeService.resolve(OperationMode.Offline);
          restoreStoredToken();
          return;
        }

        // The server answered that the session is not valid (401). Drop the stale token so it
        // cannot resurrect the session on a later offline start.
        OperationModeService.resolve(OperationMode.Online);
        TokenStorageService.clearToken();
      }
    };

    initialize().finally(() => setIsInitializing(false));
  }, [storeToken, restoreStoredToken, startSynchronization]);

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
  }, [storeToken, startSynchronization]);

  return { accessToken, isLoading, isInitializing, login };
}
