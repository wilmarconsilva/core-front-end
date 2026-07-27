import { useCallback, useState } from 'react';
import { ICrudService } from '../Interfaces/Services/ICrudService';

interface CrudState<TDetailDto, TListing> {
  listings: TListing[];
  isLoadingList: boolean;
  currentItem: TDetailDto | null;
  isLoadingItem: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

interface CrudActions<TSaveDto, TFilter> {
  loadAll: (filter: TFilter) => Promise<void>;
  loadById: (id: number) => Promise<void>;
  save: (id: number | null, dto: TSaveDto) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
  clearCurrentItem: () => void;
}

export type UseCrudResult<TSaveDto, TDetailDto, TListing, TFilter> = CrudState<TDetailDto, TListing> & CrudActions<TSaveDto, TFilter>;

export function UseCrud<TSaveDto, TDetailDto, TListing, TFilter>(
  service: ICrudService<TSaveDto, TDetailDto, TListing, TFilter>,
): UseCrudResult<TSaveDto, TDetailDto, TListing, TFilter> {
  const [listings, setListings] = useState<TListing[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [currentItem, setCurrentItem] = useState<TDetailDto | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAll = useCallback(async (filter: TFilter) => {
    setIsLoadingList(true);
    try {
      const data = await service.getAll(filter);
      setListings(data);
    } catch {
    } finally {
      setIsLoadingList(false);
    }
  }, [service]);

  const loadById = useCallback(async (id: number) => {
    setIsLoadingItem(true);
    try {
      const data = await service.getById(id);
      setCurrentItem(data);
    } catch {
    } finally {
      setIsLoadingItem(false);
    }
  }, [service]);

  const save = useCallback(async (id: number | null, dto: TSaveDto): Promise<boolean> => {
    setIsSaving(true);
    try {
      if (id) {
        await service.update(id, dto);
      } else {
        await service.create(dto);
      }
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [service]);

  const remove = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await service.delete(id);
      return true;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [service]);

  const clearCurrentItem = useCallback(() => {
    setCurrentItem(null);
  }, []);

  return {
    listings,
    isLoadingList,
    currentItem,
    isLoadingItem,
    isSaving,
    isDeleting,
    loadAll,
    loadById,
    save,
    remove,
    clearCurrentItem,
  };
}
