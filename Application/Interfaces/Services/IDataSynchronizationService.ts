export type SynchronizationStatus = 'idle' | 'syncing' | 'success' | 'error';

export type SynchronizationListener = (status: SynchronizationStatus) => void;

/**
 * Centralizes all synchronization logic between the server and the local
 * IndexedDB snapshot. Runs exclusively at application startup.
 */
export interface IDataSynchronizationService {
  synchronize(): Promise<void>;
  getStatus(): SynchronizationStatus;
  /** Subscribes to status changes. Immediately invokes the listener with the current status. */
  subscribe(listener: SynchronizationListener): () => void;
}
