import { ISynchronizationPendency } from '../../Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';
import { SynchronizationEntityType } from '../../Interfaces/DataTransferObjects/Offline/SynchronizationEntityType';
import { ISynchronizationPendencyService } from '../../Interfaces/Services/ISynchronizationPendencyService';
import { ISynchronizationPendencyRepository } from '../../../Infrastructure/Persistence/Repositories/SynchronizationPendencies/Interfaces/ISynchronizationPendencyRepository';

export class SynchronizationPendencyService implements ISynchronizationPendencyService {
  constructor(private readonly repository: ISynchronizationPendencyRepository) {}

  getAll(): Promise<ISynchronizationPendency[]> {
    return this.repository.getAll();
  }

  register(pendency: Omit<ISynchronizationPendency, 'key'>): Promise<void> {
    return this.repository.upsert({
      ...pendency,
      key: SynchronizationPendencyService.buildKey(pendency.entityType, pendency.recordId),
    });
  }

  resolve(entityType: SynchronizationEntityType, recordId: number): Promise<void> {
    return this.repository.remove(SynchronizationPendencyService.buildKey(entityType, recordId));
  }

  private static buildKey(entityType: SynchronizationEntityType, recordId: number): string {
    return `${entityType}:${recordId}`;
  }
}
