import { DBSchema } from 'idb';
import { ICurrentUserDto } from '../../../../Application/Persons/Users/DataTransferObjects/ICurrentUserDto';

export const INDEXED_DB_NAME = 'core-offline-db';
export const INDEXED_DB_VERSION = 7;

export const OfflineStoreNames = {
  products: 'products',
  customers: 'customers',
  orders: 'orders',
  budgets: 'budgets',
  localities: 'localities',
  currentUser: 'currentUser',
} as const;

export type OfflineStoreName =
  | typeof OfflineStoreNames.products
  | typeof OfflineStoreNames.customers
  | typeof OfflineStoreNames.orders
  | typeof OfflineStoreNames.budgets
  | typeof OfflineStoreNames.localities
  | typeof OfflineStoreNames.currentUser;

/** String-keyed store, kept out of OfflineStoreName (which is number-keyed). */
export const SYNCHRONIZATION_PENDENCIES_STORE_NAME = 'synchronizationPendencies';

export interface CoreDbSchema extends DBSchema {
  products: { key: number; value: { id: number } & Record<string, unknown> };
  customers: { key: number; value: { id: number } & Record<string, unknown> };
  orders: { key: number; value: { id: number } & Record<string, unknown> };
  budgets: { key: number; value: { id: number } & Record<string, unknown> };
  localities: { key: number; value: { id: number } & Record<string, unknown> };
  synchronizationPendencies: { key: string; value: { key: string } & Record<string, unknown> };
  currentUser: { key: string; value: { key: string } & ICurrentUserDto };
}
