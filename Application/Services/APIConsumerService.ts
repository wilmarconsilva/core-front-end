import Toast from 'react-native-toast-message';
import { IApiError } from '../Interfaces/DataTransferObjects/APIConsumer/IApiError';
import { WEB_SERVICE_REST_URL, fetchWithAuth, SessionExpiredError } from './HttpClientService';
import { TokenStorageService } from './TokenStorageService';
import { IRequestOptions } from '../Interfaces/DataTransferObjects/APIConsumer/IRequestOptions';
import { APIConsumerUtility } from './Utilities/APIConsumerUtility';

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class APIConsumerService {

  constructor(private readonly fetchFn: FetchFn = fetchWithAuth) {}

  protected async request<T>(
    path: string,
    requestInit: RequestInit,
    requestOptions?: IRequestOptions
  ): Promise<T> {
    try {
      const response = await this.fetchFn(`${WEB_SERVICE_REST_URL}${path}`, requestInit);

      if (!response.ok) 
      {
        let error: IApiError = {};

        const text = await response.text();
        try {
          error = JSON.parse(text);
        } catch {
          error = { detail: text };
        }

        throw { ...error, status: response.status };
      }

      const data: T = response.status === 204
        ? undefined as T
        : await (response.json() as Promise<T>);

      if (!requestOptions?.toastsConfiguration?.doNotShowSuccess) {
        Toast.show({ type: 'success', text1: 'Operação realizada com sucesso!' });
      }

      return data;
    }
    catch (err: any) {
      if (err instanceof SessionExpiredError) {
        throw err;
      }

      const apiError = err as IApiError;

      if (!TokenStorageService.isLoggingOut()) 
      {        
        const isBadRequest: boolean = APIConsumerUtility.ErrorIsBadRequest(apiError);

        const genericErrorMessage = APIConsumerUtility.GetErrorMessage(apiError);

        const message = isBadRequest ? apiError.detail ?? genericErrorMessage : genericErrorMessage;
          
        if (!requestOptions?.toastsConfiguration?.doNotShowError) {
          Toast.show({ type: isBadRequest ? 'info' : 'error', text1: message });
        }
      }
      
      throw apiError;
    }
  }

}