import { IDBPDatabase } from 'idb';
import { CoreDbSchema } from './IndexedDbSchema';

/**
 * Abstraction over the IndexedDB connection lifecycle.
 * Keeps the choice of the underlying driver (idb) isolated from the repositories.
 */
export interface IIndexedDbContext {
  getDatabase(): Promise<IDBPDatabase<CoreDbSchema>>;
}
