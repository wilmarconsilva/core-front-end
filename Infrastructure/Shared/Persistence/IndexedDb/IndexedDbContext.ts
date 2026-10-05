import { IDBPDatabase, openDB } from 'idb';
import { IIndexedDbContext } from './IIndexedDbContext';
import {
  CoreDbSchema,
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  OfflineStoreNames,
  SYNCHRONIZATION_PENDENCIES_STORE_NAME,
} from './IndexedDbSchema';

/**
 * Singleton that owns the single IndexedDB connection and its schema migrations.
 * The connection is opened lazily and reused across all repositories.
 */
export class IndexedDbContext implements IIndexedDbContext {
  private static instance: IndexedDbContext | null = null;
  private databasePromise: Promise<IDBPDatabase<CoreDbSchema>> | null = null;

  private constructor() {}

  static getInstance(): IndexedDbContext {
    if (!IndexedDbContext.instance) {
      IndexedDbContext.instance = new IndexedDbContext();
    }
    return IndexedDbContext.instance;
  }

  getDatabase(): Promise<IDBPDatabase<CoreDbSchema>> {
    if (!this.databasePromise) {
      this.databasePromise = openDB<CoreDbSchema>(INDEXED_DB_NAME, INDEXED_DB_VERSION, {
        upgrade(database, oldVersion, _newVersion, transaction)
        {
          if (!database.objectStoreNames.contains(OfflineStoreNames.products)) {
            database.createObjectStore(OfflineStoreNames.products, { keyPath: 'id' });
          }

          if (!database.objectStoreNames.contains(OfflineStoreNames.customers)) {
            database.createObjectStore(OfflineStoreNames.customers, { keyPath: 'id' });
          }

          if (!database.objectStoreNames.contains(OfflineStoreNames.orders)) {
            database.createObjectStore(OfflineStoreNames.orders, { keyPath: 'id' });
          }

          if (!database.objectStoreNames.contains(OfflineStoreNames.budgets)) {
            database.createObjectStore(OfflineStoreNames.budgets, { keyPath: 'id' });
          }

          if (!database.objectStoreNames.contains(OfflineStoreNames.localities)) {
            database.createObjectStore(OfflineStoreNames.localities, { keyPath: 'id' });
          }

          if (!database.objectStoreNames.contains(SYNCHRONIZATION_PENDENCIES_STORE_NAME)) {
            database.createObjectStore(SYNCHRONIZATION_PENDENCIES_STORE_NAME, { keyPath: 'key' });
          }

          if (!database.objectStoreNames.contains(OfflineStoreNames.currentUser)) {
            database.createObjectStore(OfflineStoreNames.currentUser, { keyPath: 'key' });
          }

          // v7: localities gained the state acronym. Emptying the store makes its count differ
          // from the API, so the next synchronization downloads them again.
          if (oldVersion > 0 && oldVersion < 7) {
            void transaction.objectStore(OfflineStoreNames.localities).clear();
          }
        },
      });
    }

    return this.databasePromise;
  }
}
