import { StyleSheet } from 'react-native';
import { colors } from '../../colors';
import { formScreenCommonStyles } from '../../formScreenCommonStyles';

/** Formulários de Orçamento e Pedido: produtos, totais e extensões sobre estilos comuns. */
const documentOnly = StyleSheet.create({
  productRow: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'flex-start',
  },
  productRowDelete: {
    alignSelf: 'flex-start',
    paddingBottom: 0,
  },
  productField: { flex: 1 },
  productSmallField: { width: 90 },
  totalText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  summaryText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
});

export const documentFormScreenStyles = {
  ...formScreenCommonStyles,
  ...documentOnly,
};
