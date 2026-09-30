import { IAuthenticationService } from './Interfaces/IAuthenticationService';
import { IAccessToken } from '../DataTransferObjects/IAccessToken';
import { ILoginRequest } from '../DataTransferObjects/ILoginRequest';
import { APIConsumerService } from '../../Shared/Services/APIConsumerService';

export class AuthenticationService extends APIConsumerService implements IAuthenticationService {

  constructor() {
    // Arrow wrapper avoids "Illegal invocation" on Hermes — native fetch cannot be detached.
    // Plain fetch (no auth interceptor) prevents circular refresh loops on auth endpoints.
    super((input, init) => fetch(input, init));
  }

  async login(request: ILoginRequest): Promise<IAccessToken> {
    return this.request<IAccessToken>('/authentication/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
    { toastsConfiguration: { doNotShowSuccess: true } });
  }

  // Errors are silenced here because both callers already handle them: the startup bootstrap
  // falls back to offline mode, and the HTTP interceptor shows its own "session expired" message.
  async refresh(): Promise<IAccessToken> {
    return this.request<IAccessToken>('/authentication/refresh', { method: 'POST', credentials: 'include' }, { toastsConfiguration: { doNotShowSuccess: true, doNotShowError: true } });
  }

  async revoke(): Promise<void> {
    await this.request<void>('/authentication/revoke', { method: 'POST', credentials: 'include' }, { toastsConfiguration: { doNotShowSuccess: true } });
  }

}
