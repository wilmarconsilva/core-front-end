/**
 * Determines whether the application has connectivity to the server.
 * Used exclusively during application startup to resolve the operation mode.
 */
export interface IConnectivityProbe {
  isOnline(): Promise<boolean>;
}
