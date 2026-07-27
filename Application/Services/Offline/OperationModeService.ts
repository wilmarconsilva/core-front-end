export enum OperationMode {
  Online = 'online',
  Offline = 'offline',
}

/**
 * Holds the operation mode resolved once during application startup.
 * Per the offline requirements the mode must NOT change during usage and can
 * only be re-evaluated after reloading the application, so it is write-once.
 */
class OperationModeServiceImplementation {
  private mode: OperationMode | null = null;

  resolve(mode: OperationMode): void {
    if (this.mode === null) {
      this.mode = mode;
    }
  }

  getMode(): OperationMode {
    return this.mode ?? OperationMode.Online;
  }

}

export const OperationModeService = new OperationModeServiceImplementation();
