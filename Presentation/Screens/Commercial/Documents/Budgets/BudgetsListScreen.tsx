import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { UsePagedCrudList } from '../../../../../Application/Hooks/UsePagedCrudList';
import { UseBudgets } from '../../../../../Application/Hooks/UseBudgets';
import { UseOperationMode } from '../../../../../Application/Hooks/UseOperationMode';
import { isLocalRecord } from '../../../../../Application/Services/Utilities/OfflineUtilities';
import { toApiDayEnd, toApiDayStart } from '../../../../../Application/Services/Utilities/DateTimeUtilities';
import { IBudgetListing } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { ICrudListScreenProps } from '../../../../Interfaces/Screens/ICrudListScreenProps';
import { IPressableInteractionState } from '../../../../Interfaces/Pressable/IPressableInteractionState';
import { ConfirmDialog } from '../../../../Components/ConfirmDialog';
import { colors, interactionStyles, tableStyles } from '../../../../Styles';
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
    creationDateTimeStart: toApiDayStart(startDate),
    creationDateTimeEnd: toApiDayEnd(endDate),
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
      extraActions={operationMode === OperationMode.Offline ? undefined : (item) => (
        <Pressable
          onPress={() => openCreateOrderConfirm(item)}
          disabled={isCreatingOrder}
          style={({ hovered }: IPressableInteractionState) => [
            tableStyles.actionButton,
            hovered && interactionStyles.actionButtonHovered,
          ]}
        >
          <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
        </Pressable>
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

