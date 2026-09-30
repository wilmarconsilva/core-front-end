import { ISynchronizationPendency } from '../../DataTransferObjects/ISynchronizationPendency';

export interface ISynchronizationPendencyRepository {
  getAll(): Promise<ISynchronizationPendency[]>;
  upsert(pendency: ISynchronizationPendency): Promise<void>;
  remove(key: string): Promise<void>;
}
