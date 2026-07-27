import { useEffect, useState } from 'react';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { SynchronizationStatus } from '../Interfaces/Services/IDataSynchronizationService';

/**
 * Subscribes the presentation layer to the synchronization status without
 * coupling it to the synchronization internals.
 */
export function UseDataSynchronization(): { status: SynchronizationStatus } {
  const service = OfflineCompositionRoot.dataSynchronizationService;
  const [status, setStatus] = useState<SynchronizationStatus>(service.getStatus());

  useEffect(() => service.subscribe(setStatus), [service]);

  return { status };
}
