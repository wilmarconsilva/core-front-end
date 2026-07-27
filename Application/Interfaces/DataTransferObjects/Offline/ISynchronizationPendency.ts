import { SynchronizationEntityType } from './SynchronizationEntityType';

/**
 * A local record rejected by the back-end during synchronization, kept until
 * the user fixes it and it is successfully resubmitted.
 */
export interface ISynchronizationPendency {
  /** Composite IndexedDB key: `${entityType}:${recordId}`. */
  key: string;
  entityType: SynchronizationEntityType;
  /** Local (negative) id of the record inside its offline store. */
  recordId: number;
  description: string;
  failureMessage: string;
}
