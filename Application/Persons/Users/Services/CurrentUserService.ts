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

  async get(): Promise<ICurrentUserDto | undefined> {
    if (OperationModeService.getMode() === OperationMode.Online) {
      try {
        return await this.fetchAndStore();
      } catch {
        // Falls back to the local snapshot.
      }
    }

    return this.repository.get();
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
