import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { ViewStyle } from 'react-native';

/**
 * Altura reservada no fim do conteúdo rolável para que o indicador de
 * sincronização, que flutua sobre a área de telas, não cubra a paginação da
 * grid no celular. A versão não entra na conta: ela é um rodapé no fluxo.
 */
export const FLOATING_BADGE_CLEARANCE = 40;

/**
 * Distância do rodapé em que os indicadores flutuantes se apoiam, medida a
 * partir do fim da área segura do aparelho.
 *
 * É o bastante para ficarem acima do selo de versão, que encerra o conteúdo
 * rolável: o texto de 11px do selo mais seus recuos ocupam ~21px, e o restante
 * é a folga entre os dois.
 */
export const FLOATING_INDICATOR_BOTTOM = 10;

/**
 * Contêiner externo das áreas roláveis de tela (ver `ScreenScrollView`).
 *
 * Ocupa a largura inteira e ao menos a altura da janela. A coluna de conteúdo
 * (limitada a 1000px e centralizada) vive dentro dele, o que deixa o selo de
 * versão livre para encostar na borda direita da janela.
 */
export const screenScrollStyles = StyleSheet.create({
  outer: {
    flexGrow: 1,
  },
});

/**
 * Moldura da aplicação: coluna que ocupa a janela, com a área de telas
 * crescendo e o rodapé de versão logo abaixo.
 */
export const appShellStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

const container: ViewStyle = {
    flexGrow: 1,
    // Horizontal menor que vertical: num iPhone, 24px de cada lado somados ao
    // padding do card consumiam ~20% da largura da tela.
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24 + FLOATING_BADGE_CLEARANCE,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
};

const elevatedSectionCard: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: 12,
  padding: 16,
  width: '100%',
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

export const layoutStyles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    ...container,
    justifyContent: 'flex-start'
  },
  loginContainer: {
    ...container,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionCard: elevatedSectionCard,
  /** Como sectionCard, com espaçamento inferior (relatórios, cartões empilhados). */
  sectionCardSpaced: {
    ...elevatedSectionCard,
    marginBottom: 16,
  },
});
