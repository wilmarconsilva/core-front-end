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

    /**
     * Distinguishes between "the server could not be reached" and "the server responded that you are not
     * authenticated". This is what allows the application to fall back to offline mode instead of logging out.
     *
     * Transport failures (connection refused, DNS errors, timeouts) cause the native fetch to reject, and
     * APIConsumerService rethrows this raw error, which does not have a status code. A reverse proxy that is
     * up while its upstream is unavailable responds with 502/503/504.
     */
    static ErrorIsServerUnreachable(error: unknown): boolean
    {
        const apiError = error as IApiError | null | undefined;

        return apiError?.status === undefined ||
                apiError.status === null ||
                apiError.status === 502 ||
                apiError.status === 503 ||
                apiError.status === 504;
    }

    static GetErrorMessage(error: unknown): string
    {
        const apiError = error as IApiError;

        return apiError.detail ?? `Status: ${apiError.status ?? "não definido."} - ${new Date().toLocaleString('pt-BR')}`;
    }
}