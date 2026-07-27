import { StyleSheet } from 'react-native';
import { colors } from './colors';

/** Estilos compartilhados por telas de listagem (filtros, valores monetários). */
export const listScreenStyles = StyleSheet.create({
  filterFieldWide: { flex: 1, minWidth: 180 },
  filterFieldCompact: { flex: 1, minWidth: 140 },
  /** Campo de filtro alinhado à barra sem margem inferior extra (ex.: localidades). */
  filterFieldFlush: { flex: 1, marginBottom: 0 },
  currency: { fontSize: 13, color: colors.textPrimary },
});
