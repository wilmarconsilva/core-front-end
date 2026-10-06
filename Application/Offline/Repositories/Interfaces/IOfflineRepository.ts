/**
 * Unified offline repository: stores SaveDto records in IndexedDB.
 * Records with id <= 0 are local/pending; id > 0 are server snapshots (Products/Customers).
 * `TSynced` is the shape the server snapshot is downloaded in (the listing, unless the
 * module has a dedicated synchronization payload).
 */
export interface IOfflineRepository<TSaveDto extends { id: number }, TListing, TFilter, TSynced = TListing> {
  getAll(filter: TFilter): Promise<TListing[]>;
  getById(id: number): Promise<TSaveDto | undefined>;
  getAllRecords(): Promise<TSaveDto[]>;
  getLocalRecords(): Promise<TSaveDto[]>;
  upsert(dto: TSaveDto): Promise<void>;
  remove(id: number): Promise<void>;
  replaceSynced(items: TSynced[]): Promise<void>;
}
