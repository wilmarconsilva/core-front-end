import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { IDocumentListing } from '../../../Application/Documents/DataTransferObjects/IDocumentListing';
import { formatCurrency, formatDateTime } from '../../../Application/Shared/Utilities/FormatUtilities';
import { IColumn } from '../../Shared/Interfaces/DataGrid/IColumn';
import { ICrudListScreenProps } from '../../Shared/Interfaces/Screens/ICrudListScreenProps';
import { DateField } from '../../Shared/Components/DateField';
import { CrudListScreen } from '../../Shared/Screens/CrudListScreen';
import { filterActionBarStyles, listScreenStyles, tableStyles } from '../../Shared/Styles';
import { OperationMode } from '../../../Application/Offline/Services/OperationModeService';

interface DocumentListState<TListing extends IDocumentListing> {
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

interface DocumentListScreenProps<TListing extends IDocumentListing> extends ICrudListScreenProps {
  title: string;
  listings: TListing[];
  isLoadingList: boolean;
  isDeleting: boolean;
  listState: DocumentListState<TListing>;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  deleteTitle: string;
  getDeleteMessage: (item: TListing | null) => string;
  extraColumns?: IColumn<TListing>[];
  extraActions?: (item: TListing) => ReactNode;
  canMutateItem?: (item: TListing) => boolean;
  operationMode: OperationMode;
}

export function DocumentListScreen<TListing extends IDocumentListing>({
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
  extraColumns = [],
  extraActions,
  canMutateItem,
  onGoBack,
  onNavigateToForm,
  operationMode,
}: DocumentListScreenProps<TListing>) {
  const columns: IColumn<TListing>[] = [
    { key: 'id', label: 'Código', flex: 1, align: 'center' },
    { key: 'custormerName', label: 'Cliente', flex: 2 },
    { key: 'customerLocalityState', label: 'Localidade/Estado', flex: 2.4 },
    {
      key: 'creationDateTime',
      label: 'Data de criação',
      flex: 1.5,
      align: 'center',
      render: (item) => (
        <Text style={tableStyles.cell}>
          {formatDateTime(item.creationDateTime)}
        </Text>
      ),
    },
  ];

  columns.push(...extraColumns);

  columns.push({
    key: 'valueTotal',
    label: 'Total',
    flex: 1,
    align: 'center',
    render: (item) => (
      <Text style={listScreenStyles.currency}>
        {formatCurrency(item.valueTotal)}
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
          <View style={filterActionBarStyles.fieldCompact}>
            <DateField
              label="Data início"
              value={startDate}
              onChangeText={setStartDate}
              onSubmitEditing={listState.handleSearch}
            />
          </View>
          <View style={filterActionBarStyles.fieldCompact}>
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
      canMutateItem={canMutateItem}
      emptyGridMessage={operationMode === OperationMode.Offline ? 'Somente registros gerados no modo offline serão exibidos.' : undefined}
    />
  );
}
