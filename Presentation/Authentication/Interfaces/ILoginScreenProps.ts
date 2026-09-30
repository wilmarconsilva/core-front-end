import { ILoginRequest } from '../../../Application/Authentication/DataTransferObjects/ILoginRequest';

export interface ILoginScreenProps {
  isLoading: boolean;
  onLogin: (request: ILoginRequest) => Promise<void>;
}
