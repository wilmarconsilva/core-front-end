import { useEffect, useState } from 'react';
import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { SynchronizationStatus } from '../Services/Interfaces/IDataSynchronizationService';

/**
 * Subscribes the presentation layer to the synchronization status without
 * coupling it to the synchronization internals.
 */
export function UseDataSynchronization(): { status: SynchronizationStatus } {
  const { dataSynchronizationService: service } = UseApplicationServices();
  const [status, setStatus] = useState<SynchronizationStatus>(service.getStatus());

  useEffect(() => service.subscribe(setStatus), [service]);

  return { status };
}
