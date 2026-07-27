import { IConnectivityProbe } from '../../Interfaces/Services/IConnectivityProbe';
import { API_BASE_URL } from '../HttpClientService';

const REACHABILITY_TIMEOUT_MS = 3000;

/**
 * Resolves connectivity using the browser online flag plus a lightweight,
 * side-effect-free reachability probe against the API base URL.
 */
export class ConnectivityProbe implements IConnectivityProbe {
  
  async isOnline(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return false;
    }

    return this.canReachServer();
  }

  private async canReachServer(): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REACHABILITY_TIMEOUT_MS);

    try {
      await fetch(API_BASE_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }
}
