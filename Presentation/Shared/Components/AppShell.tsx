import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IAppShellProps } from '../Interfaces/AppShell/IAppShellProps';
import { appShellStyles } from '../Styles';

/**
 * Moldura da aplicação: a área de telas ocupa toda a altura disponível.
 *
 * Recua o conteúdo das faixas do sistema no topo e nas laterais — relógio,
 * câmera e cantos arredondados. Recuar aqui, e não em cada tela, evita que
 * navegação e formulários repitam a regra.
 *
 * A borda inferior fica de fora de propósito: recuá-la aqui criaria uma faixa
 * sólida presa ao rodapé, visível o tempo todo no iPhone. O espaço do
 * indicador de gestos é devolvido dentro da área rolável (ver
 * `ScreenScrollView`), onde rola junto com o conteúdo em vez de emoldurá-lo.
 *
 * O selo de versão também não vive aqui: ele encerra o conteúdo rolável de
 * cada tela, para aparecer só quando se chega ao fim.
 */
export function AppShell({ children }: IAppShellProps) {
  return (
    <SafeAreaView style={appShellStyles.root} edges={['top', 'left', 'right']}>
      <View style={appShellStyles.content}>{children}</View>
    </SafeAreaView>
  );
}
