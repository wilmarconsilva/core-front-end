import { ICurrentUserDto } from '../../DataTransferObjects/ICurrentUserDto';

/** Snapshot local do usuário autenticado, para uso no modo offline. */
export interface ICurrentUserOfflineRepository {
  get(): Promise<ICurrentUserDto | undefined>;
  save(user: ICurrentUserDto): Promise<void>;
}
