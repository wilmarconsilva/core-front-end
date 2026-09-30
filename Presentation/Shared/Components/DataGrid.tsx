import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, ScrollView, Text, View } from 'react-native';
import { ColumnAlign, IColumn } from '../Interfaces/DataGrid/IColumn';
import { IDataGridProps } from '../Interfaces/DataGrid/IDataGridProps';
import { IPressableInteractionState } from '../Interfaces/Pressable/IPressableInteractionState';
import { colors, interactionStyles, tableStyles, TABLE_ROW_HORIZONTAL_PADDING, TOUCH_TARGET_MIN } from '../Styles';

export type { IColumn } from '../Interfaces/DataGrid/IColumn';

function getCellValue<T>(item: T, key: keyof T | string): string {
  const value = (item as Record<string, unknown>)[key as string];
  if (value === null || value === undefined) return '';
  return String(value);
}

const ACTIONS_GAP = 8;
const FLEX_UNIT_WIDTH = 70;

const ALIGN_TO_FLEX: Record<ColumnAlign, 'flex-start' | 'center' | 'flex-end'> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

function getColumnMinWidth<T>(col: IColumn<T>): number {
  return col.minWidth ?? Math.round((col.flex ?? 1) * FLEX_UNIT_WIDTH);
}

function getColumnAlign<T>(col: IColumn<T>): ColumnAlign {
  return col.align ?? 'left';
}

export function DataGrid<T>({
  columns,
  data,
  isLoading,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  canMutateItem,
  onRowPress,
  keyExtractor,
  extraActions,
  emptyGridMessage = 'Nenhum registro encontrado.',
}: IDataGridProps<T>) {
  const hasActions = Boolean(onEdit || onDelete || extraActions);
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // A coluna de ações acompanha quantas ações existem: listagens de Orçamento
  // têm três (editar, excluir, gerar pedido) e não cabiam numa largura fixa.
  const actionCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + (extraActions ? 1 : 0);
  const actionsColumnWidth = actionCount === 0
    ? 0
    : actionCount * TOUCH_TARGET_MIN + (actionCount - 1) * ACTIONS_GAP + TABLE_ROW_HORIZONTAL_PADDING;

  const contentMinWidth = columns.reduce((sum, col) => sum + getColumnMinWidth(col), 0)
    + actionsColumnWidth
    + TABLE_ROW_HORIZONTAL_PADDING * 2;
  const contentWidth = Math.max(containerWidth, contentMinWidth);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = data.length < pageSize;

  return (
    <View style={[tableStyles.container, { width: '100%' }]} onLayout={onLayout}>
      <ScrollView horizontal>
        <View style={{ width: contentWidth }}>
          {/* Header */}
          <View style={tableStyles.header}>
            {columns.map((col, idx) => (
              <Text
                key={idx}
                style={[
                  tableStyles.headerCell,
                  {
                    flexGrow: col.flex ?? 1,
                    flexShrink: 0,
                    flexBasis: getColumnMinWidth(col),
                    paddingRight: 8,
                    textAlign: getColumnAlign(col),
                  },
                ]}
                numberOfLines={2}
              >
                {col.label}
              </Text>
            ))}
            {hasActions && (
              <Text style={[tableStyles.headerCell, { width: actionsColumnWidth, textAlign: 'center' }]}>
                Ações
              </Text>
            )}
          </View>

          {/* Loading */}
          {isLoading && (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {/* Empty */}
          {!isLoading && data.length === 0 && (
            <Text style={tableStyles.emptyText}>{emptyGridMessage}</Text>
          )}

          {/* Rows */}
          {!isLoading && data.map((item, rowIdx) => {
            const canMutate = canMutateItem?.(item) ?? true;
            const rowStyle = [
              tableStyles.row,
              rowIdx === data.length - 1 && { borderBottomWidth: 0 },
            ];
            const rowContent = (
              <>
                {columns.map((col, colIdx) => {
                  const align = getColumnAlign(col);
                  return (
                    <View
                      key={colIdx}
                      style={{
                        flexGrow: col.flex ?? 1,
                        flexShrink: 0,
                        flexBasis: getColumnMinWidth(col),
                        paddingRight: 8,
                        alignItems: ALIGN_TO_FLEX[align],
                      }}
                    >
                      {col.render ? (
                        col.render(item)
                      ) : (
                        <Text style={[tableStyles.cell, { textAlign: align }]} numberOfLines={2}>
                          {getCellValue(item, col.key)}
                        </Text>
                      )}
                    </View>
                  );
                })}
                {hasActions && (
                  <View style={[tableStyles.actionsCell, { width: actionsColumnWidth }]}>
                    {onEdit && canMutate && (
                      <Pressable
                        onPress={() => onEdit(item)}
                        style={({ hovered }: IPressableInteractionState) => [
                          tableStyles.actionButton,
                          hovered && interactionStyles.actionButtonHovered,
                        ]}
                      >
                        <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
                      </Pressable>
                    )}
                    {onDelete && canMutate && (
                      <Pressable
                        onPress={() => onDelete(item)}
                        style={({ hovered }: IPressableInteractionState) => [
                          tableStyles.actionButton,
                          hovered && interactionStyles.actionButtonHovered,
                        ]}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </Pressable>
                    )}
                    {extraActions && extraActions(item)}
                  </View>
                )}
              </>
            );

            return onRowPress ? (
              <Pressable
                key={keyExtractor(item)}
                style={({ hovered }: IPressableInteractionState) => [
                  ...rowStyle,
                  hovered && interactionStyles.rowHovered,
                ]}
                onPress={() => onRowPress(item)}
              >
                {rowContent}
              </Pressable>
            ) : (
              <View key={keyExtractor(item)} style={rowStyle}>
                {rowContent}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Pagination */}
      <View style={tableStyles.paginationContainer}>
        <Pressable
          onPress={() => onPageChange(page - 1)}
          disabled={isPrevDisabled}
          style={({ hovered }: IPressableInteractionState) => [
            tableStyles.paginationButton,
            isPrevDisabled && tableStyles.paginationButtonDisabled,
            !isPrevDisabled && hovered && interactionStyles.actionButtonHovered,
          ]}
        >
          <Ionicons name="chevron-back" size={14} color={colors.textPrimary} />
          <Text style={tableStyles.paginationButtonText}>Anterior</Text>
        </Pressable>

        <View style={tableStyles.paginationPageChip}>
          <Text style={tableStyles.paginationPageText}>{page}</Text>
        </View>

        <Pressable
          onPress={() => onPageChange(page + 1)}
          disabled={isNextDisabled}
          style={({ hovered }: IPressableInteractionState) => [
            tableStyles.paginationButton,
            isNextDisabled && tableStyles.paginationButtonDisabled,
            !isNextDisabled && hovered && interactionStyles.actionButtonHovered,
          ]}
        >
          <Text style={tableStyles.paginationButtonText}>Próxima</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
