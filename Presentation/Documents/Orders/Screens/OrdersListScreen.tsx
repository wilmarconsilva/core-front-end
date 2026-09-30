import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { UsePagedCrudList } from '../../../../Application/Shared/Hooks/UsePagedCrudList';
import { UseOrders } from '../../../../Application/Documents/Orders/Hooks/UseOrders';
import { UseOperationMode } from '../../../../Application/Offline/Hooks/UseOperationMode';
import { isLocalRecord } from '../../../../Application/Offline/Utilities/OfflineUtilities';
import { toApiDayEnd, toApiDayStart } from '../../../../Application/Shared/Utilities/DateTimeUtilities';
import { IOrderListing } from '../../../../Application/Documents/Orders/DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../../../../Application/Documents/Orders/DataTransferObjects/IOrderListingFilter';
import { ICrudListScreenProps } from '../../../Shared/Interfaces/Screens/ICrudListScreenProps';
import { tableStyles } from '../../../Shared/Styles';
import { DocumentListScreen } from '../../Screens/DocumentListScreen';
import { OperationMode } from '../../../../Application/Offline/Services/OperationModeService';

export function OrdersListScreen({ onGoBack, onNavigateToForm }: ICrudListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove } = UseOrders();
  const operationMode = UseOperationMode();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const buildFilter = useCallback((p: number, pageSize: number): IOrderListingFilter => ({
    registersStart: (p - 1) * pageSize,
    registersEnd: p * pageSize,
    creationDateTimeStart: toApiDayStart(startDate),
    creationDateTimeEnd: toApiDayEnd(endDate),
  }), [startDate, endDate]);

  const listState = UsePagedCrudList<IOrderListing, IOrderListingFilter>({
    loadAll,
    remove,
    buildFilter,
  });

  return (
    <DocumentListScreen<IOrderListing>
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
          flex: 1.1,
          align: 'center',
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

