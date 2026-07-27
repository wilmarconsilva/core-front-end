import { StyleSheet } from 'react-native';
import { colors } from './colors';

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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 16,
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
    gap: 4,
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
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
    gap: 4,
    paddingVertical: 6,
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
