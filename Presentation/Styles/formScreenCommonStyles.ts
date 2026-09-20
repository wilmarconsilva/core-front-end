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
    paddingHorizontal: 16,
    paddingVertical: 24,
    ...panelShadow,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 16,
    ...panelShadow,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  documentFooterActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  flex1: { flex: 1 },

  /**
   * Slots de campo dentro de `row`. O `flexBasis` decide QUANDO a linha quebra:
   * `rowFieldWide` empilha no celular, `rowFieldCompact` continua lado a lado
   * (usar para valores curtos como Número e CEP).
   */
  rowFieldWide: { flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0 },
  rowFieldCompact: { flexGrow: 1, flexShrink: 1, flexBasis: 110, minWidth: 0 },
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
