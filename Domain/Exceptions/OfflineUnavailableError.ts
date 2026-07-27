import Toast from 'react-native-toast-message';

export const OFFLINE_UNAVAILABLE_MESSAGE = 'Funcionalidade indisponível no modo offline.';

export class OfflineUnavailableError extends Error {
  constructor(message: string = OFFLINE_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = 'OfflineUnavailableError';
  }
}

/**
 * Notifies the user that an operation is blocked offline and throws so the
 * calling flow is interrupted without persisting anything.
 */
export function blockOfflineOperation(): never {
  Toast.show({ type: 'info', text1: OFFLINE_UNAVAILABLE_MESSAGE });
  throw new OfflineUnavailableError();
}
