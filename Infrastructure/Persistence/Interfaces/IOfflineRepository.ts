/**
 * Unified offline repository: stores SaveDto records in IndexedDB.
 * Records with id <= 0 are local/pending; id > 0 are server snapshots (Products/Customers).
 */
export interface IOfflineRepository<TSaveDto extends { id: number }, TListing, TFilter> {
  getAll(filter: TFilter): Promise<TListing[]>;
  getById(id: number): Promise<TSaveDto | undefined>;
  getAllRecords(): Promise<TSaveDto[]>;
  getLocalRecords(): Promise<TSaveDto[]>;
  upsert(dto: TSaveDto): Promise<void>;
  remove(id: number): Promise<void>;
  replaceSynced(items: TListing[]): Promise<void>;
}
