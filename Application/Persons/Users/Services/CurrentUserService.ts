import { RequiredDataUnavailableError } from '../../../../Domain/Shared/Exceptions/RequiredDataUnavailableError';
import { OperationMode, OperationModeService } from '../../../Offline/Services/OperationModeService';
import { ICurrentUserDto } from '../DataTransferObjects/ICurrentUserDto';
import { ICurrentUserOfflineRepository } from '../Repositories/Interfaces/ICurrentUserOfflineRepository';
import { ICurrentUserApiService } from './Interfaces/ICurrentUserApiService';
import { ICurrentUserService } from './Interfaces/ICurrentUserService';

/**
 * Online a API é a fonte da verdade (evita usar o snapshot de outro usuário após um novo login);
 * se ela falhar, ou no modo offline, usa o snapshot gravado na última sincronização.
 */
export class CurrentUserService implements ICurrentUserService {
  constructor(
    private readonly apiService: ICurrentUserApiService,
    private readonly repository: ICurrentUserOfflineRepository,
  ) {}

  async get(): Promise<ICurrentUserDto> {
    if (OperationModeService.getMode() === OperationMode.Online) {
      try {
        return await this.fetchAndStore();
      } catch {
        // Falls back to the local snapshot.
      }
    }

    const user = await this.repository.get();
    if (!user) throw new RequiredDataUnavailableError('Usuário atual não sincronizado. Conecte-se à internet e sincronize os dados.');

    return user;
  }

  async synchronize(): Promise<void> {
    await this.fetchAndStore();
  }

  private async fetchAndStore(): Promise<ICurrentUserDto> {
    const user = await this.apiService.get();
    await this.repository.save(user);
    return user;
  }
}
