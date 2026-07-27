import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IDataGridProps } from '../Interfaces/DataGrid/IDataGridProps';
import { colors, tableStyles } from '../Styles';

export type { IColumn } from '../Interfaces/DataGrid/IColumn';

function getCellValue<T>(item: T, key: keyof T | string): string {
  const value = (item as Record<string, unknown>)[key as string];
  if (value === null || value === undefined) return '';
  return String(value);
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
  const hasActions = onEdit || onDelete || extraActions;
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = data.length < pageSize;

  return (
    <View style={[tableStyles.container, { width: '100%' }]} onLayout={onLayout}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: containerWidth || '100%' }}>
          {/* Header */}
          <View style={tableStyles.header}>
            {columns.map((col, idx) => (
              <Text
                key={idx}
                style={[tableStyles.headerCell, { flex: col.flex ?? 1, paddingRight: 8 }]}
                numberOfLines={1}
              >
                {col.label}
              </Text>
            ))}
            {hasActions && (
              <Text style={[tableStyles.headerCell, { width: 100 }]}>Ações</Text>
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
                {columns.map((col, colIdx) => (
                  <View key={colIdx} style={{ flex: col.flex ?? 1, paddingRight: 8 }}>
                    {col.render ? (
                      col.render(item)
                    ) : (
                      <Text style={tableStyles.cell} numberOfLines={2}>
                        {getCellValue(item, col.key)}
                      </Text>
                    )}
                  </View>
                ))}
                {hasActions && (
                  <View style={[tableStyles.actionsCell, { width: 100 }]}>
                    {onEdit && canMutate && (
                      <TouchableOpacity
                        onPress={() => onEdit(item)}
                        activeOpacity={0.7}
                        style={tableStyles.actionButton}
                      >
                        <Ionicons name="pencil-outline" size={15} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                    {onDelete && canMutate && (
                      <TouchableOpacity
                        onPress={() => onDelete(item)}
                        activeOpacity={0.7}
                        style={tableStyles.actionButton}
                      >
                        <Ionicons name="trash-outline" size={15} color={colors.error} />
                      </TouchableOpacity>
                    )}
                    {extraActions && extraActions(item)}
                  </View>
                )}
              </>
            );

            return onRowPress ? (
              <TouchableOpacity
                key={keyExtractor(item)}
                style={rowStyle}
                activeOpacity={0.6}
                onPress={() => onRowPress(item)}
              >
                {rowContent}
              </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => onPageChange(page - 1)}
          disabled={isPrevDisabled}
          activeOpacity={0.7}
          style={[tableStyles.paginationButton, isPrevDisabled && tableStyles.paginationButtonDisabled]}
        >
          <Ionicons name="chevron-back" size={14} color={colors.textPrimary} />
          <Text style={tableStyles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>

        <View style={tableStyles.paginationPageChip}>
          <Text style={tableStyles.paginationPageText}>{page}</Text>
        </View>

        <TouchableOpacity
          onPress={() => onPageChange(page + 1)}
          disabled={isNextDisabled}
          activeOpacity={0.7}
          style={[tableStyles.paginationButton, isNextDisabled && tableStyles.paginationButtonDisabled]}
        >
          <Text style={tableStyles.paginationButtonText}>Próxima</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
