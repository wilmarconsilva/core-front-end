import { ICurrentUserDto } from '../../DataTransferObjects/ICurrentUserDto';

export interface ICurrentUserService {
  /**
   * Online lê da API (e atualiza o snapshot); offline lê o snapshot local. O snapshot sempre
   * existe, pois o usuário sincroniza online ao menos uma vez antes de operar offline.
   */
  get(): Promise<ICurrentUserDto>;
  /** Atualiza o snapshot local a partir da API. */
  synchronize(): Promise<void>;
}
