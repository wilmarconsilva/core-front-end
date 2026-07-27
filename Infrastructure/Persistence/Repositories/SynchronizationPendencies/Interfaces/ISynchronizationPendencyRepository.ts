import { ISynchronizationPendency } from '../../../../../Application/Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';

export interface ISynchronizationPendencyRepository {
  getAll(): Promise<ISynchronizationPendency[]>;
  upsert(pendency: ISynchronizationPendency): Promise<void>;
  remove(key: string): Promise<void>;
}
