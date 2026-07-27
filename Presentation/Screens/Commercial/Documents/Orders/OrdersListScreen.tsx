import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { UsePagedCrudList } from '../../../../../Application/Hooks/UsePagedCrudList';
import { UseOrders } from '../../../../../Application/Hooks/UseOrders';
import { UseOperationMode } from '../../../../../Application/Hooks/UseOperationMode';
import { isLocalRecord } from '../../../../../Application/Services/Utilities/OfflineUtilities';
import { IOrderListing } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListing';
import { IOrderListingFilter } from '../../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListingFilter';
import { ICrudListScreenProps } from '../../../../Interfaces/Screens/ICrudListScreenProps';
import { tableStyles } from '../../../../Styles';
import { CommercialDocumentListScreen } from '../CommercialDocumentListScreen';
import { OperationMode } from '../../../../../Application/Services/Offline/OperationModeService';

export function OrdersListScreen({ onGoBack, onNavigateToForm }: ICrudListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove } = UseOrders();
  const operationMode = UseOperationMode();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const buildFilter = useCallback((p: number, pageSize: number): IOrderListingFilter => ({
    registersStart: (p - 1) * pageSize,
    registersEnd: p * pageSize,
    creationDateTimeStart: startDate || undefined,
    creationDateTimeEnd: endDate || undefined,
  }), [startDate, endDate]);

  const listState = UsePagedCrudList<IOrderListing, IOrderListingFilter>({
    loadAll,
    remove,
    buildFilter,
  });

  return (
    <CommercialDocumentListScreen<IOrderListing>
      title="Pedidos"
      listings={listings}
      isLoadingList={isLoadingList}
      isDeleting={isDeleting}
      listState={listState}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      deleteTitle="Excluir Pedido"
      getDeleteMessage={(item) => `Deseja excluir o pedido ${item?.id}?`}
      extraColumns={[
        {
          key: 'budgetId',
          label: 'Orçamento',
          flex: 0.8,
          render: (item) => (
            <Text style={tableStyles.cell}>
              {item.budgetId ?? ''}
            </Text>
          ),
        },
      ]}
      onGoBack={onGoBack}
      onNavigateToForm={onNavigateToForm}
      canMutateItem={operationMode === OperationMode.Offline ? (item) => isLocalRecord(item.id) : undefined}
      operationMode={operationMode}
    />
  );
}

