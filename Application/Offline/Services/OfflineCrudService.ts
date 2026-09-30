import { ICrudService } from '../../Shared/Services/Interfaces/ICrudService';
import { IOfflineRepository } from '../Repositories/Interfaces/IOfflineRepository';
import { OperationMode, OperationModeService } from './OperationModeService';
import {
  assignLocalId,
  blockIfNotLocalWhenOffline,
  isLocalRecord,
  notifyOfflineSaved,
  toApiCreatePayload,
} from '../Utilities/OfflineUtilities';
import { blockOfflineOperation } from '../../../Domain/Offline/Exceptions/OfflineUnavailableError';

export type OfflineListingMapper<TSaveDto, TListing> = (
  dto: TSaveDto,
) => TListing | Promise<TListing>;

export interface OfflineCrudConfig<TSaveDto extends { id: number }, TDetailDto, TListing, TFilter> {
  repository: IOfflineRepository<TSaveDto, TListing, TFilter>;
  toListing: OfflineListingMapper<TSaveDto, TListing>;
  toDetail: (dto: TSaveDto) => Promise<TDetailDto>;
  listingScope: 'snapshot' | 'localOnly';
  /** Invoked after a local record is resubmitted online with success (e.g. to resolve its synchronization pendency). */
  onLocalRecordSynchronized?: (localId: number, serverId: number) => Promise<void>;
}

/**
 * Decorator over an API-backed CRUD service. Online it delegates fully to the API.
 * Offline it routes reads/writes to IndexedDB; only local records (id <= 0) can be
 * mutated. Snapshot entities (Products/Customers) also serve cached server listings.
 */
export class OfflineCrudService<TSaveDto extends { id: number }, TDetailDto, TListing, TFilter>
  implements ICrudService<TSaveDto, TDetailDto, TListing, TFilter> {
  constructor(
    private readonly apiService: ICrudService<TSaveDto, TDetailDto, TListing, TFilter>,
    private readonly config: OfflineCrudConfig<TSaveDto, TDetailDto, TListing, TFilter>,
  ) {}

  async getAll(filter: TFilter): Promise<TListing[]> {
    if (OperationModeService.getMode() === OperationMode.Offline) {
      return this.config.repository.getAll(filter);
    }
    return this.apiService.getAll(filter);
  }

  async getById(id: number): Promise<TDetailDto> {
    // Local records only exist in IndexedDB, so they are read locally even online
    // (e.g. when editing a synchronization pendency).
    if (OperationModeService.getMode() === OperationMode.Offline || isLocalRecord(id)) {
      blockIfNotLocalWhenOffline(id);
      const record = await this.config.repository.getById(id);
      if (!record) {
        blockOfflineOperation();
      }
      return this.config.toDetail(record);
    }
    return this.apiService.getById(id);
  }

  async create(dto: TSaveDto): Promise<TSaveDto> {
    if (OperationModeService.getMode() === OperationMode.Offline) {
      const records = await this.config.repository.getAllRecords();
      const offlineDto = assignLocalId(dto, records.map((record) => record.id));
      await this.config.repository.upsert(offlineDto);
      notifyOfflineSaved();
      return offlineDto;
    }
    return this.apiService.create(dto);
  }

  async update(id: number, dto: TSaveDto): Promise<TSaveDto> {
    if (OperationModeService.getMode() === OperationMode.Offline) {
      blockIfNotLocalWhenOffline(id);
      const updated = { ...dto, id };
      await this.config.repository.upsert(updated);
      return updated;
    }
    if (isLocalRecord(id)) {
      return this.resubmitLocalRecord(id, dto);
    }
    return this.apiService.update(id, dto);
  }

  /**
   * Online save of a record created offline: submits it as a new record to the
   * back-end and, on success, discards the local copy.
   */
  private async resubmitLocalRecord(localId: number, dto: TSaveDto): Promise<TSaveDto> {
    const created = await this.apiService.create(toApiCreatePayload(dto));
    await this.config.repository.remove(localId);
    await this.config.onLocalRecordSynchronized?.(localId, created.id);
    return created;
  }

  async delete(id: number): Promise<void> {
    if (OperationModeService.getMode() === OperationMode.Offline) {
      blockIfNotLocalWhenOffline(id);
      await this.config.repository.remove(id);
      return;
    }
    return this.apiService.delete(id);
  }
}
