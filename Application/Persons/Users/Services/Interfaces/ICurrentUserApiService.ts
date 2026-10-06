import { ICurrentUserDto } from '../../DataTransferObjects/ICurrentUserDto';

export interface ICurrentUserApiService {
  get(): Promise<ICurrentUserDto>;
}
