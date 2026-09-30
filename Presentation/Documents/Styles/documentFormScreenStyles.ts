import { StyleSheet } from 'react-native';
import { colors } from '../../Shared/Styles/colors';
import { formScreenCommonStyles } from '../../Shared/Styles/formScreenCommonStyles';

/** Formulários de Orçamento e Pedido: produtos, totais e extensões sobre estilos comuns. */
const documentOnly = StyleSheet.create({
  productRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  /**
   * O flexBasis alto faz "Produto" ocupar a linha inteira no celular (Qtd. e
   * Vl. Unit. caem para a linha de baixo) e permanecer lado a lado no desktop.
   */
  productField: { flexGrow: 1, flexShrink: 1, flexBasis: 240, minWidth: 0 },
  productSmallField: { flexGrow: 0, flexShrink: 0, flexBasis: 90 },
  totalText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  summaryText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
});

export const documentFormScreenStyles = {
  ...formScreenCommonStyles,
  ...documentOnly,
};
