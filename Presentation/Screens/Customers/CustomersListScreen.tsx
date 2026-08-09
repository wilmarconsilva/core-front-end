import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { FormField } from '../../Components/FormField';
import { UseCustomers } from '../../../Application/Hooks/UseCustomers';
import { UsePagedCrudList } from '../../../Application/Hooks/UsePagedCrudList';
import { UseOperationMode } from '../../../Application/Hooks/UseOperationMode';
import { ICustomerListing } from '../../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerListingFilter } from '../../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerListingFilter';
import { ICrudListScreenProps } from '../../Interfaces/Screens/ICrudListScreenProps';
import { listScreenStyles } from '../../Styles';
import { CrudListScreen } from '../CrudListScreen';
import { isLocalRecord } from '../../../Application/Services/Utilities/OfflineUtilities';
import { OperationMode } from '../../../Application/Services/Offline/OperationModeService';

export function CustomersListScreen({ onGoBack, onNavigateToForm }: ICrudListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove } = UseCustomers();
  const operationMode = UseOperationMode();
  const [name, setName] = useState('');

  const buildFilter = useCallback((p: number, pageSize: number): ICustomerListingFilter => ({
    registersStart: (p - 1) * pageSize,
    registersEnd: p * pageSize,
    name: name.trim() || undefined,
  }), [name]);

  const listState = UsePagedCrudList<ICustomerListing, ICustomerListingFilter>({
    loadAll,
    remove,
    buildFilter,
  });

  return (
    <CrudListScreen<ICustomerListing>
      title="Clientes"
      onGoBack={onGoBack}
      onNavigateToForm={onNavigateToForm}
      filterContent={(
        <View style={listScreenStyles.filterFieldWide}>
          <FormField
            label="Nome"
            placeholder="Filtrar por nome..."
            value={name}
            onChangeText={setName}
            onSubmitEditing={listState.handleSearch}
          />
        </View>
      )}
      columns={[
        { key: 'id', label: 'Código', flex: 1 },
        { key: 'name', label: 'Nome', flex: 2 },
        { key: 'localityState', label: 'Localidade/Estado', flex: 1.2 },
      ]}
      data={listings}
      isLoading={isLoadingList}
      isDeleting={isDeleting}
      page={listState.page}
      pageSize={listState.pageSize}
      onSearch={listState.handleSearch}
      onPageChange={listState.handlePageChange}
      onDelete={listState.openDeleteConfirm}
      deleteDialogVisible={listState.deleteDialogVisible}
      deleteTarget={listState.deleteTarget}
      deleteTitle="Excluir Cliente"
      getDeleteMessage={(item) => `Deseja excluir o cliente "${item?.name}"?`}
      onConfirmDelete={listState.confirmDelete}
      onCancelDelete={listState.closeDeleteConfirm}
      canMutateItem={operationMode === OperationMode.Offline ? (item) => isLocalRecord(item.id) : undefined}
    />
  );
}
