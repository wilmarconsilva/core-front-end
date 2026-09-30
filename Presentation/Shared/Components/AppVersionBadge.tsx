import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppVersion } from '../../../Configuration/Versions/AppVersion';
import { colors } from '../Styles';

/**
 * Selo discreto com a versão em execução, alinhado à direita.
 *
 * Encerra o conteúdo rolável de cada tela (ver `ScreenScrollView`): aparece
 * quando o usuário chega ao fim, e não ocupa espaço fixo no rodapé da janela.
 */
export function AppVersionBadge() {
  return (
    <View style={styles.footer} pointerEvents="none">
      <Text style={styles.label}>v{AppVersion.semanticVersion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    // Encosta na borda direita da janela: o selo fica fora da coluna de
    // conteúdo, que é limitada em largura e centralizada.
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
