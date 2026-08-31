import { IConnectivityProbe } from '../../Interfaces/Services/IConnectivityProbe';
import { API_BASE_URL } from '../HttpClientService';

const REACHABILITY_TIMEOUT_MS = 3000;

/** Liveness endpoint exposed anonymously by the API (Program.cs). */
const HEALTH_PATH = '/health';

/**
 * Resolves connectivity using the browser online flag plus a lightweight,
 * side-effect-free reachability probe against the API health endpoint.
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
      // The health endpoint is probed instead of the base URL because a reverse proxy that routes
      // by path may serve the base URL from the front-end itself, hiding a dead API.
      // The status is checked on purpose: a proxy that is up while the API is down answers 502,
      // and "no-cors" would resolve that as success.
      const response = await fetch(`${API_BASE_URL}${HEALTH_PATH}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }
}
