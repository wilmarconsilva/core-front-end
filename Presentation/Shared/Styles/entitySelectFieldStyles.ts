import { StyleSheet } from 'react-native';
import { colors } from './colors';
import {
  INPUT_BORDER_RADIUS,
  INPUT_BORDER_WIDTH,
  INPUT_FONT_SIZE,
  INPUT_PADDING_HORIZONTAL,
  INPUT_PADDING_VERTICAL,
} from './inputTokens';

export const entitySelectFieldStyles = StyleSheet.create({
  trigger: {
    borderWidth: INPUT_BORDER_WIDTH,
    borderColor: colors.border,
    borderRadius: INPUT_BORDER_RADIUS,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    paddingVertical: INPUT_PADDING_VERTICAL,
    backgroundColor: colors.surfaceAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerError: {
    borderColor: colors.error,
  },
  triggerText: {
    fontSize: INPUT_FONT_SIZE,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    color: colors.textPlaceholder,
  },
  arrow: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentContainer: {
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
