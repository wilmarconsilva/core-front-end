import { ICurrentUserDto } from '../../../../Application/Persons/Users/DataTransferObjects/ICurrentUserDto';
import { ICurrentUserOfflineRepository } from '../../../../Application/Persons/Users/Repositories/Interfaces/ICurrentUserOfflineRepository';
import { IIndexedDbContext } from '../../../Shared/Persistence/IndexedDb/IIndexedDbContext';
import { OfflineStoreNames } from '../../../Shared/Persistence/IndexedDb/IndexedDbSchema';

/** O store guarda um único registro: o usuário autenticado no dispositivo. */
const CURRENT_USER_KEY = 'current';

export class CurrentUserOfflineRepository implements ICurrentUserOfflineRepository {
  constructor(private readonly context: IIndexedDbContext) {}

  async get(): Promise<ICurrentUserDto | undefined> {
    const database = await this.context.getDatabase();
    const record = await database.get(OfflineStoreNames.currentUser, CURRENT_USER_KEY);

    if (!record) return undefined;

    const { key: _key, ...user } = record;
    return user;
  }

  async save(user: ICurrentUserDto): Promise<void> {
    const database = await this.context.getDatabase();
    await database.put(OfflineStoreNames.currentUser, { ...user, key: CURRENT_USER_KEY });
  }
}
