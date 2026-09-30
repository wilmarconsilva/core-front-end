import Toast from 'react-native-toast-message';
import { OperationMode, OperationModeService } from '../Services/OperationModeService';
import { blockOfflineOperation } from '../../../Domain/Offline/Exceptions/OfflineUnavailableError';

export const OFFLINE_SAVED_MESSAGE = 'Registro salvo localmente. Será sincronizado quando houver conexão com a internet.';

export function isLocalRecord(id: number): boolean {
  return id <= 0;
}

export function assignLocalId<T extends { id: number }>(dto: T, existingIds: number[]): T {
  if (dto.id > 0) {
    return dto;
  }

  const localIds = existingIds.filter(isLocalRecord);
  const minId = localIds.length > 0 ? Math.min(...localIds) : 0;

  return { ...dto, id: minId <= 0 ? minId - 1 : -1 };
}

export function toApiCreatePayload<T extends { id: number }>(dto: T): T {
  return { ...dto, id: 0 };
}

export function notifyOfflineSaved(): void {
  Toast.show({ type: 'success', text1: OFFLINE_SAVED_MESSAGE });
}

export function blockIfNotLocalWhenOffline(id: number): void {
  if (OperationModeService.getMode() === OperationMode.Offline && !isLocalRecord(id)) {
    blockOfflineOperation();
  }
}
