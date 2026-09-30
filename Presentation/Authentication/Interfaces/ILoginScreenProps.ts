import { ILoginRequest } from '../../../Application/Interfaces/DataTransferObjects/Authentication/ILoginRequest';

export interface ILoginScreenProps {
  isLoading: boolean;
  onLogin: (request: ILoginRequest) => Promise<void>;
}
