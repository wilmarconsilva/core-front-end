import { useCallback, useState } from 'react';

export interface UseDeleteConfirmDialogParams {
  remove: (id: number) => Promise<boolean>;
  reloadAfterDelete: () => void | Promise<void>;
}

export interface UseDeleteConfirmDialogResult<T extends { id: number }> {
  deleteTarget: T | null;
  deleteDialogVisible: boolean;
  openDeleteConfirm: (item: T) => void;
  closeDeleteConfirm: () => void;
  confirmDelete: () => Promise<void>;
}

/**
 * Estado e fluxo do diálogo de exclusão: visibilidade separada do alvo,
 * fechar só em Cancelar ou após confirmar (sempre fecha ao fim de confirmar).
 */
export function UseDeleteConfirmDialog<T extends { id: number }>(
  params: UseDeleteConfirmDialogParams,
): UseDeleteConfirmDialogResult<T> {
  const { remove, reloadAfterDelete } = params;
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const openDeleteConfirm = useCallback((item: T) => {
    setDeleteTarget(item);
    setDeleteDialogVisible(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteDialogVisible(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteTarget) {
      const success = await remove(deleteTarget.id);
      if (success) {
        await Promise.resolve(reloadAfterDelete());
      }
    }
    setDeleteDialogVisible(false);
  }, [deleteTarget, remove, reloadAfterDelete]);

  return {
    deleteTarget,
    deleteDialogVisible,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
  };
}
