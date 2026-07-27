import { StyleSheet } from 'react-native';
import { colors } from '../../colors';

/** Relatórios de Orçamentos e Pedidos (filtros, resumo, linhas). */
export const documentReportScreenStyles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  actionBtn: { marginTop: 0, paddingHorizontal: 16, paddingVertical: 12 },
  summaryBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryLabel: { color: colors.textWhite, fontSize: 14, marginBottom: 4 },
  summaryValue: { color: colors.textWhite, fontSize: 28, fontWeight: '700' },
  reportRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  reportRowAlt: { backgroundColor: colors.surfaceAlt },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reportId: { fontSize: 12, color: colors.textSecondary },
  reportTotal: { fontSize: 14, fontWeight: '700', color: colors.primary },
  reportCustomer: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  reportCity: { fontSize: 12, color: colors.textSecondary },
  reportDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  reportPayment: { fontSize: 12, color: colors.textSecondary },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  pdfButtonText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: colors.textSecondary, paddingVertical: 24, fontSize: 14 },
});
