import { IApiError } from '../../Interfaces/DataTransferObjects/APIConsumer/IApiError';

export class APIConsumerUtility 
{
    static ErrorIsBadRequest(error: unknown): boolean 
    {
        const apiError = error as IApiError;

        return apiError.status !== undefined &&
                apiError.status !== null &&
                apiError.status >= 400 &&
                apiError.status < 500;
    }

    static GetErrorMessage(error: unknown): string
    {
        const apiError = error as IApiError;

        return apiError.detail ?? `Status: ${apiError.status ?? "não definido."} - ${new Date().toLocaleString('pt-BR')}`;
    }
}