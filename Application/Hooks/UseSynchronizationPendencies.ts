import { useCallback, useEffect, useState } from 'react';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { ISynchronizationPendency } from '../Interfaces/DataTransferObjects/Offline/ISynchronizationPendency';

/**
 * Exposes the synchronization pendencies (offline records rejected by the
 * back-end) to the presentation layer.
 */
export function UseSynchronizationPendencies() {
  const service = OfflineCompositionRoot.synchronizationPendencyService;
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
