import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IScreenScrollViewProps } from '../Interfaces/ScreenScrollView/IScreenScrollViewProps';
import { screenScrollStyles } from '../Styles';
import { AppVersionBadge } from './AppVersionBadge';

/**
 * Área rolável de uma tela, encerrada pelo selo de versão.
 *
 * O selo vive no fim do conteúdo, e não preso ao rodapé da janela: só aparece
 * quando o usuário chega ao fim da tela, sem ocupar espaço permanente nem
 * acompanhar a rolagem.
 *
 * O `contentContainerStyle` recebido é aplicado a uma coluna interna, e não ao
 * contêiner de conteúdo do `ScrollView`. É isso que permite ao selo encostar na
 * borda direita da janela: ele fica fora da coluna, que é limitada em largura e
 * centralizada. A coluna cresce (`flexGrow`) e empurra o selo para o fim, então
 * em telas curtas ele se apoia no rodapé da área visível sem criar rolagem.
 *
 * O recuo do indicador de gestos do iPhone é devolvido aqui, e não na moldura:
 * como padding do conteúdo, ele rola junto e o rodapé continua livre de faixas
 * fixas.
 *
 * Use nas áreas roláveis de tela inteira; as de dentro de modais continuam com
 * `ScrollView` direto, onde o selo não faria sentido.
 */
export function ScreenScrollView({
  children,
  contentContainerStyle,
  ...scrollViewProps
}: IScreenScrollViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      {...scrollViewProps}
      contentContainerStyle={[screenScrollStyles.outer, { paddingBottom: insets.bottom }]}
    >
      <View style={contentContainerStyle}>{children}</View>
      <AppVersionBadge />
    </ScrollView>
  );
}
