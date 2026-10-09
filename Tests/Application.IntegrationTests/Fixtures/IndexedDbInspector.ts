import { openDB } from 'idb';
import {
  CoreDbSchema,
  INDEXED_DB_NAME,
  OfflineStoreName,
  SYNCHRONIZATION_PENDENCIES_STORE_NAME,
} from '../../../Infrastructure/Shared/Persistence/IndexedDb/IndexedDbSchema';
import { ISynchronizationPendency } from '../../../Application/Offline/DataTransferObjects/ISynchronizationPendency';

type InspectedStoreName = OfflineStoreName | typeof SYNCHRONIZATION_PENDENCIES_STORE_NAME;

/**
 * Lê o conteúdo cru das stores do IndexedDB, por fora das abstrações da aplicação,
 * para verificar o que de fato ficou persistido no dispositivo.
 */
export class IndexedDbInspector {
  static async getAll<T>(storeName: InspectedStoreName): Promise<T[]> {
    const database = await openDB<CoreDbSchema>(INDEXED_DB_NAME);
    try {
      return (await database.getAll(storeName)) as unknown as T[];
    } finally {
      database.close();
    }
  }

  static async getIds(storeName: OfflineStoreName): Promise<number[]> {
    const records = await IndexedDbInspector.getAll<{ id: number }>(storeName);
    return records.map((record) => record.id);
  }

  static getPendencies(): Promise<ISynchronizationPendency[]> {
    return IndexedDbInspector.getAll<ISynchronizationPendency>(SYNCHRONIZATION_PENDENCIES_STORE_NAME);
  }
}
