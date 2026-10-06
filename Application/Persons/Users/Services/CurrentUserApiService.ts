import { APIConsumerService } from '../../../Shared/Services/APIConsumerService';
import { ICurrentUserDto } from '../DataTransferObjects/ICurrentUserDto';
import { ICurrentUserApiService } from './Interfaces/ICurrentUserApiService';

export class CurrentUserApiService extends APIConsumerService implements ICurrentUserApiService {
  async get(): Promise<ICurrentUserDto> {
    return this.request<ICurrentUserDto>('/users/current', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, { toastsConfiguration: { doNotShowSuccess: true, doNotShowError: true } });
  }
}
