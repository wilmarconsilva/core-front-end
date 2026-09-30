import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { FormField } from '../../Shared/Components/FormField';
import { UsePagedCrudList } from '../../../Application/Shared/Hooks/UsePagedCrudList';
import { UseProducts } from '../../../Application/Products/Hooks/UseProducts';
import { UseOperationMode } from '../../../Application/Offline/Hooks/UseOperationMode';
import { IProductListing } from '../../../Application/Products/DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../../../Application/Products/DataTransferObjects/IProductListingFilter';
import { ICrudListScreenProps } from '../../Shared/Interfaces/Screens/ICrudListScreenProps';
import { filterActionBarStyles } from '../../Shared/Styles';
import { CrudListScreen } from '../../Shared/Screens/CrudListScreen';
import { isLocalRecord } from '../../../Application/Offline/Utilities/OfflineUtilities';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';

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
        <View style={filterActionBarStyles.fieldWide}>
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
        { key: 'id', label: 'Código', flex: 1, align: 'center' },
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
