import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { FormField } from '../../Components/FormField';
import { UsePagedCrudList } from '../../../Application/Hooks/UsePagedCrudList';
import { UseProducts } from '../../../Application/Hooks/UseProducts';
import { UseOperationMode } from '../../../Application/Hooks/UseOperationMode';
import { IProductListing } from '../../../Application/Interfaces/DataTransferObjects/Products/IProductListing';
import { IProductListingFilter } from '../../../Application/Interfaces/DataTransferObjects/Products/IProductListingFilter';
import { ICrudListScreenProps } from '../../Interfaces/Screens/ICrudListScreenProps';
import { listScreenStyles } from '../../Styles';
import { CrudListScreen } from '../CrudListScreen';
import { isLocalRecord } from '../../../Application/Services/Utilities/OfflineUtilities';
import { OperationMode } from '../../../Application/Services/Offline/OperationModeService';

export function ProductsListScreen({ onGoBack, onNavigateToForm }: ICrudListScreenProps) {
  const { listings, isLoadingList, isDeleting, loadAll, remove } = UseProducts();
  const operationMode = UseOperationMode();
  const [description, setDescription] = useState('');

  const buildFilter = useCallback((p: number, pageSize: number): IProductListingFilter => ({
    registersStart: (p - 1) * pageSize,
    registersEnd: p * pageSize,
    description: description.trim() || undefined,
  }), [description]);

  const listState = UsePagedCrudList<IProductListing, IProductListingFilter>({
    loadAll,
    remove,
    buildFilter,
  });

  return (
    <CrudListScreen<IProductListing>
      title="Produtos"
      onGoBack={onGoBack}
      onNavigateToForm={onNavigateToForm}
      filterContent={(
        <View style={listScreenStyles.filterFieldWide}>
          <FormField
            label="Descrição"
            placeholder="Filtrar..."
            value={description}
            onChangeText={setDescription}
            onSubmitEditing={listState.handleSearch}
          />
        </View>
      )}
      columns={[
        { key: 'id', label: 'Código', flex: 1 },
        { key: 'description', label: 'Descrição', flex: 2 },
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
      deleteTitle="Excluir Produto"
      getDeleteMessage={(item) => `Deseja excluir o produto "${item?.description}"?`}
      onConfirmDelete={listState.confirmDelete}
      onCancelDelete={listState.closeDeleteConfirm}
      canMutateItem={operationMode === OperationMode.Offline ? (item) => isLocalRecord(item.id) : undefined}
    />
  );
}
