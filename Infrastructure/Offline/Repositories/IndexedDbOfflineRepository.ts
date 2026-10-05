import { IListingFilter } from '../../../Application/Shared/DataTransferObjects/Listings/IListingFilter';
import { IOfflineRepository } from '../../../Application/Offline/Repositories/Interfaces/IOfflineRepository';
import { isLocalRecord } from '../../../Application/Offline/Utilities/OfflineUtilities';
import { IIndexedDbContext } from '../../Shared/Persistence/IndexedDb/IIndexedDbContext';
import { OfflineStoreName } from '../../Shared/Persistence/IndexedDb/IndexedDbSchema';

export type OfflineListingMapper<TSaveDto, TListing> = (
  dto: TSaveDto,
) => TListing | Promise<TListing>;

export type OfflineFilterPredicate<TListing, TFilter> = (item: TListing, filter: TFilter) => boolean;

/**
 * Generic IndexedDB-backed offline repository storing full SaveDto records.
 * Listing projection and filtering are applied in memory.
 */
export class IndexedDbOfflineRepository<
  TSaveDto extends { id: number },
  TListing extends { id: number },
  TFilter extends IListingFilter,
  TSynced = TListing,
> implements IOfflineRepository<TSaveDto, TListing, TFilter, TSynced>
{
  
  constructor(
    protected readonly context: IIndexedDbContext,
    protected readonly storeName: OfflineStoreName,

    private readonly toListing: OfflineListingMapper<TSaveDto, TListing>,
    private readonly matches: OfflineFilterPredicate<TListing, TFilter>,
    private readonly syncedToSaveDto: (item: TSynced) => TSaveDto,
  ) {}

  async getAll(filter: TFilter): Promise<TListing[]> {
    const records = await this.getAllRecords();
    const listings = await Promise.all(records.map((record) => this.toListing(record)));

    const filtered = listings
      .filter((item) => this.matches(item, filter))
      .sort((first, second) => first.id - second.id);

    const start = filter.registersStart ?? 0;
    const end = filter.registersEnd ?? filtered.length;

    return filtered.slice(start, end);
  }

  async getById(id: number): Promise<TSaveDto | undefined> {
    const database = await this.context.getDatabase();
    return (await database.get(this.storeName, id)) as unknown as TSaveDto | undefined;
  }

  async getAllRecords(): Promise<TSaveDto[]> {
    const database = await this.context.getDatabase();
    return (await database.getAll(this.storeName)) as unknown as TSaveDto[];
  }

  async getLocalRecords(): Promise<TSaveDto[]> {
    const records = await this.getAllRecords();
    return records.filter((record) => isLocalRecord(record.id));
  }

  async upsert(dto: TSaveDto): Promise<void> {
    const database = await this.context.getDatabase();
    await database.put(this.storeName, dto as never);
  }

  async remove(id: number): Promise<void> {
    const database = await this.context.getDatabase();
    await database.delete(this.storeName, id);
  }

  async replaceSynced(items: TSynced[]): Promise<void> {
    const existing = await this.getAllRecords();
    const database = await this.context.getDatabase();
    const transaction = database.transaction(this.storeName, 'readwrite');

    await Promise.all([
      ...existing.filter((record) => record.id > 0).map((record) => transaction.store.delete(record.id)),
      ...items.map((item) => transaction.store.put(this.syncedToSaveDto(item) as never)),
      transaction.done,
    ]);
  }
}
