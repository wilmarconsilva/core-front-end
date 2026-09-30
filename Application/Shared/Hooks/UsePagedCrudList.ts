import { useCallback, useEffect, useState } from 'react';
import { UseDeleteConfirmDialog } from './UseDeleteConfirmDialog';

interface UsePagedCrudListParams<TListing extends { id: number }, TFilter> {
  loadAll: (filter: TFilter) => Promise<void>;
  remove: (id: number) => Promise<boolean>;
  buildFilter: (page: number, pageSize: number) => TFilter;
  pageSize?: number;
}

export function UsePagedCrudList<TListing extends { id: number }, TFilter>({
  loadAll,
  remove,
  buildFilter,
  pageSize = 50,
}: UsePagedCrudListParams<TListing, TFilter>) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAll(buildFilter(1, pageSize));
  }, []);

  const handleSearch = useCallback(() => {
    setPage(1);
    loadAll(buildFilter(1, pageSize));
  }, [loadAll, buildFilter, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    loadAll(buildFilter(newPage, pageSize));
  }, [loadAll, buildFilter, pageSize]);

  const reloadCurrentPage = useCallback(() => {
    loadAll(buildFilter(page, pageSize));
  }, [loadAll, buildFilter, page, pageSize]);

  const deleteDialog = UseDeleteConfirmDialog<TListing>({
    remove,
    reloadAfterDelete: reloadCurrentPage,
  });

  return {
    page,
    pageSize,
    handleSearch,
    handlePageChange,
    reloadCurrentPage,
    ...deleteDialog,
  };
}
