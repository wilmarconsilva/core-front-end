import { StyleSheet } from 'react-native';

export const filterActionBarStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  btn: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  /**
   * Slots de campo de filtro.
   *
   * `flexBasis` define QUANDO a linha quebra (é o tamanho hipotético que o
   * flexbox usa para decidir a quebra); `minWidth: 0` garante que o campo
   * encolhe em vez de transbordar o contêiner. Usar `minWidth` como piso, ao
   * contrário, força overflow quando não cabe - foi o que causava a
   * sobreposição dos campos de data no WebKit do iOS.
   */
  fieldWide: { flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0 },
  fieldCompact: { flexGrow: 1, flexShrink: 1, flexBasis: 170, minWidth: 0 },
});
