import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { UsePagedCrudList } from '../../../../Application/Shared/Hooks/UsePagedCrudList';
import { UseBudgets } from '../../../../Application/Documents/Budgets/Hooks/UseBudgets';
import { UseOperationMode } from '../../../../Application/Offline/Hooks/UseOperationMode';
import { isLocalRecord } from '../../../../Application/Offline/Utilities/OfflineUtilities';
import { toApiDayEnd, toApiDayStart } from '../../../../Application/Shared/Utilities/DateTimeUtilities';
import { IBudgetListing } from '../../../../Application/Documents/Budgets/DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../../../../Application/Documents/Budgets/DataTransferObjects/IBudgetListingFilter';
import { IBudgetsListScreenProps } from '../Interfaces/IBudgetsListScreenProps';
import { IPressableInteractionState } from '../../../Shared/Interfaces/Pressable/IPressableInteractionState';
import { ConfirmDialog } from '../../../Shared/Components/ConfirmDialog';
import { colors, interactionStyles, tableStyles } from '../../../Shared/Styles';
import { DocumentListScreen } from '../../Screens/DocumentListScreen';
import { OperationMode } from '../../../../Application/Offline/Services/OperationModeService';

export function BudgetsListScreen({ onGoBack, onNavigateToForm, onNavigateToOrderForm }: IBudgetsListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove } = UseBudgets();
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

  const confirmCreateOrder = () => {
    if (!createOrderTarget) return;

    onNavigateToOrderForm(createOrderTarget.id);
    closeCreateOrderConfirm();
  };

  return (
    <>
    <DocumentListScreen<IBudgetListing>
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
      message={createOrderTarget ? `Deseja criar um pedido a partir do orçamento ${createOrderTarget.id}?\n\nOs dados serão carregados no formulário para conferência.` : ''}
      onConfirm={confirmCreateOrder}
      onCancel={closeCreateOrderConfirm}
      confirmLabel="Criar Pedido"
    />
    </>
  );
}

