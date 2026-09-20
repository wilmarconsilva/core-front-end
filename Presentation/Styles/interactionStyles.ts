import { StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * Estados de interação (foco e hover) centralizados em um único lugar.
 *
 * No react-native-web o callback de estilo de <Pressable> entrega `hovered` e
 * `focused` além de `pressed`; no iOS/Android eles chegam undefined e as regras
 * simplesmente não se aplicam, então o mesmo código serve às duas plataformas.
 */
export const interactionStyles = StyleSheet.create({
  /**
   * Realce de foco para campos de formulário (WCAG 2.4.7 - Focus Visible).
   * Só troca a cor da borda, nunca a largura: mudar a largura deslocaria o
   * conteúdo do campo em 1px a cada foco.
   */
  focusRing: {
    borderColor: colors.primary,
  },
  /** Realce sutil para elementos clicáveis sob o cursor. */
  hovered: {
    opacity: 0.85,
  },
  /** Realce de linha da grid sob o cursor. */
  rowHovered: {
    backgroundColor: '#F9FBF9',
  },
  /** Realce de botão de ação da grid sob o cursor. */
  actionButtonHovered: {
    backgroundColor: '#E5E7EB',
  },
});
