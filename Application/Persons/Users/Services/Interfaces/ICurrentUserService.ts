import { ICurrentUserDto } from '../../DataTransferObjects/ICurrentUserDto';

export interface ICurrentUserService {
  /** Online lê da API (e atualiza o snapshot); offline lê o snapshot local. */
  get(): Promise<ICurrentUserDto | undefined>;
  /** Atualiza o snapshot local a partir da API. */
  synchronize(): Promise<void>;
}
