import { IAccessToken } from '../../DataTransferObjects/IAccessToken';
import { ILoginRequest } from '../../DataTransferObjects/ILoginRequest';

export interface IAuthenticationService {
  login(request: ILoginRequest): Promise<IAccessToken>;
  refresh(): Promise<IAccessToken>;
  revoke(): Promise<void>;
}
