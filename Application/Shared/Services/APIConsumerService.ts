import Toast from 'react-native-toast-message';
import { IApiError } from '../DataTransferObjects/APIConsumer/IApiError';
import { WEB_SERVICE_REST_URL, fetchWithAuth, SessionExpiredError } from './HttpClientService';
import { TokenStorageService } from '../../Authentication/Services/TokenStorageService';
import { IRequestOptions } from '../DataTransferObjects/APIConsumer/IRequestOptions';
import { APIConsumerUtility } from '../Utilities/APIConsumerUtility';

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
        const error = await APIConsumerService.readError(response);

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

  /**
   * Only a body written by the API becomes the error detail: an empty body or an HTML page
   * (e.g. a reverse proxy 502/503) is discarded, so the generic message of
   * APIConsumerUtility.GetErrorMessage is shown instead.
   */
  private static async readError(response: Response): Promise<IApiError> {
    const text = await response.text();
    const contentType = response.headers.get('Content-Type') ?? '';

    if (!text.trim() || contentType.includes('text/html')) {
      return {};
    }

    try {
      const parsed: unknown = JSON.parse(text);
      return typeof parsed === 'object' && parsed !== null ? parsed as IApiError : { detail: String(parsed) };
    } catch {
      return { detail: text };
    }
  }

}