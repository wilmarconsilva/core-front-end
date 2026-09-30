import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { TOUCH_TARGET_MIN } from './inputTokens';

export const TABLE_ROW_HORIZONTAL_PADDING = 16;

export const tableStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f9fbf9',
    paddingVertical: 12,
    paddingHorizontal: TABLE_ROW_HORIZONTAL_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: TABLE_ROW_HORIZONTAL_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  rowAlt: {},
  cell: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  actionsCell: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 44x44: um dos alvos é Excluir, destrutivo - não pode depender de precisão. */
  actionButton: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: TOUCH_TARGET_MIN,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  paginationButtonDisabled: {
    opacity: 0.35,
  },
  paginationButtonText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  paginationPageChip: {
    minHeight: TOUCH_TARGET_MIN,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  paginationPageText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textPlaceholder,
    paddingVertical: 40,
    fontSize: 14,
  },
});
