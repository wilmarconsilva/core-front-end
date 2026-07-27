import { StyleSheet } from 'react-native';
import { colors } from './colors';

const panelShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

const outlineButtonBase = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 6,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderWidth: 1.5,
  borderColor: colors.primary,
  borderRadius: 8,
  alignSelf: 'flex-start' as const,
};

/** Blocos de formulário reutilizados em cadastros simples e documentos comerciais. */
export const formScreenCommonStyles = StyleSheet.create({
  entityCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    ...panelShadow,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    ...panelShadow,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  documentFooterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  row: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  addCustomerAddressButton: {
    ...outlineButtonBase,
    marginBottom: 16,
  },
  addDocumentProductButton: {
    ...outlineButtonBase,
    marginTop: 4,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
