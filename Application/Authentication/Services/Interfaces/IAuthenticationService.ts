import { IAccessToken } from '../DataTransferObjects/Authentication/IAccessToken';
import { ILoginRequest } from '../DataTransferObjects/Authentication/ILoginRequest';

export interface IAuthenticationService {
  login(request: ILoginRequest): Promise<IAccessToken>;
  refresh(): Promise<IAccessToken>;
  revoke(): Promise<void>;
}
