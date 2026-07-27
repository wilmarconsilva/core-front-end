import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { UsePagedCrudList } from '../../../../../Application/Hooks/UsePagedCrudList';
import { UseBudgets } from '../../../../../Application/Hooks/UseBudgets';
import { UseOperationMode } from '../../../../../Application/Hooks/UseOperationMode';
import { isLocalRecord } from '../../../../../Application/Services/Utilities/OfflineUtilities';
import { IBudgetListing } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { ICrudListScreenProps } from '../../../../Interfaces/Screens/ICrudListScreenProps';
import { ConfirmDialog } from '../../../../Components/ConfirmDialog';
import { colors } from '../../../../Styles';
import { CommercialDocumentListScreen } from '../CommercialDocumentListScreen';
import { OperationMode } from '../../../../../Application/Services/Offline/OperationModeService';

export function BudgetsListScreen({ onGoBack, onNavigateToForm }: ICrudListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove, isCreatingOrder, createOrderByBudget } = UseBudgets();
  const operationMode = UseOperationMode();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [createOrderDialogVisible, setCreateOrderDialogVisible] = useState(false);
  const [createOrderTarget, setCreateOrderTarget] = useState<IBudgetListing | null>(null);

  const buildFilter = useCallback((p: number, pageSize: number): IBudgetListingFilter => ({
    registersStart: (p - 1) * pageSize,
    registersEnd: p * pageSize,
    creationDateTimeStart: startDate || undefined,
    creationDateTimeEnd: endDate || undefined,
  }), [startDate, endDate]);

  const listState = UsePagedCrudList<IBudgetListing, IBudgetListingFilter>({
    loadAll,
    remove,
    buildFilter,
  });

  const openCreateOrderConfirm = (item: IBudgetListing) => {
    setCreateOrderTarget(item);
    setCreateOrderDialogVisible(true);
  };

  const closeCreateOrderConfirm = () => {
    setCreateOrderDialogVisible(false);
  };

  const confirmCreateOrder = async () => {
    if (!createOrderTarget) return;
    const success = await createOrderByBudget(createOrderTarget.id);
    if (success) {
      listState.reloadCurrentPage();
      closeCreateOrderConfirm();
    }
  };

  return (
    <>
    <CommercialDocumentListScreen<IBudgetListing>
      title="Orçamentos"
      listings={listings}
      isLoadingList={isLoadingList}
      isDeleting={isDeleting}
      listState={listState}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      deleteTitle="Excluir Orçamento"
      getDeleteMessage={(item) => `Deseja excluir o orçamento ${item?.id}?`}
      showCreationDate
      extraActions={operationMode === OperationMode.Offline ? undefined : (item) => (
        <TouchableOpacity
          onPress={() => openCreateOrderConfirm(item)}
          activeOpacity={0.7}
          disabled={isCreatingOrder}
        >
          <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
      onGoBack={onGoBack}
      onNavigateToForm={onNavigateToForm}
      canMutateItem={operationMode === OperationMode.Offline ? (item) => isLocalRecord(item.id) : undefined}
      operationMode={operationMode}
    />
    <ConfirmDialog
      visible={createOrderDialogVisible}
      title="Criar Pedido"
      message={createOrderTarget ? `Deseja criar um pedido a partir do orçamento ${createOrderTarget.id}?` : ''}
      onConfirm={confirmCreateOrder}
      onCancel={closeCreateOrderConfirm}
      isLoading={isCreatingOrder}
      confirmLabel="Criar Pedido"
    />
    </>
  );
}

