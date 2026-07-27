import { ISynchronizationPendency } from '../../../../Application/Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';
import { IIndexedDbContext } from '../../IndexedDb/IIndexedDbContext';
import { SYNCHRONIZATION_PENDENCIES_STORE_NAME } from '../../IndexedDb/IndexedDbSchema';
import { ISynchronizationPendencyRepository } from './Interfaces/ISynchronizationPendencyRepository';

export class SynchronizationPendencyRepository implements ISynchronizationPendencyRepository {
  constructor(private readonly context: IIndexedDbContext) {}

  async getAll(): Promise<ISynchronizationPendency[]> {
    const database = await this.context.getDatabase();
    return (await database.getAll(SYNCHRONIZATION_PENDENCIES_STORE_NAME)) as unknown as ISynchronizationPendency[];
  }

  async upsert(pendency: ISynchronizationPendency): Promise<void> {
    const database = await this.context.getDatabase();
    await database.put(SYNCHRONIZATION_PENDENCIES_STORE_NAME, pendency as never);
  }

  async remove(key: string): Promise<void> {
    const database = await this.context.getDatabase();
    await database.delete(SYNCHRONIZATION_PENDENCIES_STORE_NAME, key);
  }
}
