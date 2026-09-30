import { ISynchronizationPendency } from '../../DataTransferObjects/ISynchronizationPendency';
import { SynchronizationEntityType } from '../../DataTransferObjects/SynchronizationEntityType';

/**
 * Tracks local records rejected by the back-end during synchronization so the
 * user can review, fix and resubmit them.
 */
export interface ISynchronizationPendencyService {
  getAll(): Promise<ISynchronizationPendency[]>;
  register(pendency: Omit<ISynchronizationPendency, 'key'>): Promise<void>;
  /** Removes the pendency of a record after it synchronizes successfully. */
  resolve(entityType: SynchronizationEntityType, recordId: number): Promise<void>;
}
