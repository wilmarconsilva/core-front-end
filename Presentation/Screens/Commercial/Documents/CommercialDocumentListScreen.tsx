import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { IDocumentListing } from '../../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/IDocumentListing';
import { IColumn } from '../../../Interfaces/DataGrid/IColumn';
import { ICrudListScreenProps } from '../../../Interfaces/Screens/ICrudListScreenProps';
import { CrudOperationType, CrudOperationTypeUtility } from '../../../../Infrastructure/Persistence/Enums/CrudOperationType';
import { DateField } from '../../../Components/DateField';
import { CrudListScreen } from '../../CrudListScreen';
import { listScreenStyles, tableStyles } from '../../../Styles';
import { OperationMode } from '../../../../Application/Services/Offline/OperationModeService';

interface CommercialDocumentListState<TListing extends IDocumentListing> {
  page: number;
  pageSize: number;
  handleSearch: () => void;
  handlePageChange: (page: number) => void;
  openDeleteConfirm: (item: TListing) => void;
  deleteDialogVisible: boolean;
  deleteTarget: TListing | null;
  confirmDelete: () => Promise<void>;
  closeDeleteConfirm: () => void;
}

interface CommercialDocumentListScreenProps<TListing extends IDocumentListing> extends ICrudListScreenProps {
  title: string;
  listings: TListing[];
  isLoadingList: boolean;
  isDeleting: boolean;
  listState: CommercialDocumentListState<TListing>;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  deleteTitle: string;
  getDeleteMessage: (item: TListing | null) => string;
  showCreationDate?: boolean;
  extraColumns?: IColumn<TListing>[];
  extraActions?: (item: TListing) => ReactNode;
  allowedCrudOperationTypes?: CrudOperationType[];
  canMutateItem?: (item: TListing) => boolean;
  operationMode: OperationMode;
}

export function CommercialDocumentListScreen<TListing extends IDocumentListing>({
  title,
  listings,
  isLoadingList,
  isDeleting,
  listState,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  deleteTitle,
  getDeleteMessage,
  showCreationDate = false,
  extraColumns = [],
  extraActions,
  allowedCrudOperationTypes = CrudOperationTypeUtility.getAll(),
  canMutateItem,
  onGoBack,
  onNavigateToForm,
  operationMode,
}: CommercialDocumentListScreenProps<TListing>) {
  const columns: IColumn<TListing>[] = [
    { key: 'id', label: 'Código', flex: 0.4 },
    { key: 'custormerName', label: 'Cliente', flex: 2 },
    { key: 'customerLocalityState', label: 'Localidade/Estado', flex: 1.5 },
  ];

  if (showCreationDate) {
    columns.push({
      key: 'creationDateTime',
      label: 'Data de criação',
      flex: 1.5,
      render: (item) => (
        <Text style={tableStyles.cell}>
          {new Date(item.creationDateTime).toLocaleString('pt-BR')}
        </Text>
      ),
    });
  }

  columns.push(...extraColumns);

  columns.push({
    key: 'valueTotal',
    label: 'Total',
    flex: 1,
    render: (item) => (
      <Text style={listScreenStyles.currency}>
        {item.valueTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Text>
    ),
  });

  return (
    <CrudListScreen<TListing>
      title={title}
      onGoBack={onGoBack}
      onNavigateToForm={onNavigateToForm}
      filterContent={(
        <>
          <View style={listScreenStyles.filterFieldCompact}>
            <DateField
              label="Data início"
              value={startDate}
              onChangeText={setStartDate}
              onSubmitEditing={listState.handleSearch}
            />
          </View>
          <View style={listScreenStyles.filterFieldCompact}>
            <DateField
              label="Data fim"
              value={endDate}
              onChangeText={setEndDate}
              onSubmitEditing={listState.handleSearch}
            />
          </View>
        </>
      )}
      columns={columns}
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
      deleteTitle={deleteTitle}
      getDeleteMessage={getDeleteMessage}
      onConfirmDelete={listState.confirmDelete}
      onCancelDelete={listState.closeDeleteConfirm}
      extraActions={extraActions}
      allowedCrudOperationTypes={allowedCrudOperationTypes}
      canMutateItem={canMutateItem}
      emptyGridMessage={operationMode === OperationMode.Offline ? 'Somente registros gerados no modo offline serão exibidos.' : undefined}
    />
  );
}
