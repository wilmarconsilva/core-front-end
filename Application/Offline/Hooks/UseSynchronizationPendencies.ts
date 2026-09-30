import { useCallback, useEffect, useState } from 'react';
import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { ISynchronizationPendency } from '../DataTransferObjects/ISynchronizationPendency';

/**
 * Exposes the synchronization pendencies (offline records rejected by the
 * back-end) to the presentation layer.
 */
export function UseSynchronizationPendencies() {
  const { synchronizationPendencyService: service } = UseApplicationServices();
  const [pendencies, setPendencies] = useState<ISynchronizationPendency[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setPendencies(await service.getAll());
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void load();
  }, [load]);

  return { pendencies, isLoading, reload: load };
}
