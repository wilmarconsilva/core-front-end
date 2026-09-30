import { OperationMode, OperationModeService } from '../Services/Offline/OperationModeService';

/**
 * Exposes the operation mode resolved at startup to the presentation layer.
 * The mode is stable for the whole session, so no subscription is required.
 */
export function UseOperationMode(): OperationMode {
  return OperationModeService.getMode()
}
