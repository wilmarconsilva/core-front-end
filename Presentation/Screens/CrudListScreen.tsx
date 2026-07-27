import React, { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { IColumn } from '../Interfaces/DataGrid/IColumn';
import { Breadcrumb } from '../Components/Breadcrumb';
import { ConfirmDialog } from '../Components/ConfirmDialog';
import { DataGrid } from '../Components/DataGrid';
import { FilterActionBar } from '../Components/FilterActionBar';
import { layoutStyles, typographyStyles } from '../Styles';
import { CrudOperationType, CrudOperationTypeUtility } from '../../Infrastructure/Persistence/Enums/CrudOperationType';

interface CrudListScreenProps<TListing extends { id: number }> {
  title: string;
  onGoBack: () => void;
  onNavigateToForm: (id?: number) => void;
  filterContent: ReactNode;
  columns: IColumn<TListing>[];
  data: TListing[];
  isLoading: boolean;
  isDeleting: boolean;
  page: number;
  pageSize: number;
  onSearch: () => void;
  onPageChange: (page: number) => void;
  onDelete: (item: TListing) => void;
  deleteDialogVisible: boolean;
  deleteTarget: TListing | null;
  deleteTitle: string;
  getDeleteMessage: (item: TListing | null) => string;
  onConfirmDelete: () => Promise<void>;
  onCancelDelete: () => void;
  keyExtractor?: (item: TListing) => string;
  newLabel?: string;
  extraActions?: (item: TListing) => ReactNode;
  allowedCrudOperationTypes?: CrudOperationType[];
  canMutateItem?: (item: TListing) => boolean;
  emptyGridMessage?: string;
}

export function CrudListScreen<TListing extends { id: number }>({
  title,
  onGoBack,
  onNavigateToForm,
  filterContent,
  columns,
  data,
  isLoading,
  isDeleting,
  page,
  pageSize,
  onSearch,
  onPageChange,
  onDelete,
  deleteDialogVisible,
  deleteTarget,
  deleteTitle,
  getDeleteMessage,
  onConfirmDelete,
  onCancelDelete,
  keyExtractor = (item) => String(item.id),
  newLabel,
  extraActions,
  allowedCrudOperationTypes = CrudOperationTypeUtility.getAll(),
  canMutateItem,
  emptyGridMessage = 'Nenhum registro encontrado.',
}: CrudListScreenProps<TListing>) {
  return (
    <View style={layoutStyles.screenWrapper}>
      <ScrollView contentContainerStyle={layoutStyles.scrollContainer}>
        <Breadcrumb items={[{ label: 'Início', onPress: onGoBack }, { label: title }]} />
        <Text style={typographyStyles.title}>{title}</Text>

        <View style={layoutStyles.sectionCard}>
          <FilterActionBar
            onSearch={onSearch}
            onNew={allowedCrudOperationTypes.includes(CrudOperationType.Create) ? () => onNavigateToForm() : undefined}
            newLabel={newLabel}
          >
            {filterContent}
          </FilterActionBar>

          <DataGrid<TListing>
            columns={columns}
            data={data}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onEdit={allowedCrudOperationTypes.includes(CrudOperationType.Update) ? (item) => onNavigateToForm(item.id) : undefined}
            onDelete={allowedCrudOperationTypes.includes(CrudOperationType.Delete) ? onDelete : undefined}
            canMutateItem={canMutateItem}
            keyExtractor={keyExtractor}
            extraActions={extraActions}
            emptyGridMessage={emptyGridMessage}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title={deleteTitle}
        message={getDeleteMessage(deleteTarget)}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        isLoading={isDeleting}
        confirmLabel="Excluir"
      />
    </View>
  );
}
