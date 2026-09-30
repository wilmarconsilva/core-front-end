import type { CSSProperties } from 'react';
import { colors } from './colors';
import {
  INPUT_BORDER_RADIUS,
  INPUT_BORDER_WIDTH,
  INPUT_FONT_SIZE,
  INPUT_HEIGHT,
  INPUT_LINE_HEIGHT,
  INPUT_PADDING_HORIZONTAL,
  INPUT_PADDING_VERTICAL,
} from './inputTokens';

/**
 * Estilo do <input type="date"> nativo do DOM usado pelo DateField na web.
 *
 * Este elemento é o único campo do projeto que escapa do reset de base que o
 * react-native-web aplica a todo <View>, então precisa declarar explicitamente
 * o que lá vem de graça: box-sizing, min-width e a remoção da aparência nativa.
 *
 * `appearance: none` é a correção central: no WebKit do iOS o widget nativo de
 * date-and-time tem largura intrínseca mínima e ignora `width: 100%`, fazendo o
 * campo transbordar a caixa e sobrepor o campo vizinho. Remover a aparência
 * nativa não desabilita o date picker do sistema, apenas o layout do widget.
 */
const webInputBase: CSSProperties = {
  display: 'block',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  height: INPUT_HEIGHT,
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
  appearance: 'none',
  borderStyle: 'solid',
  borderWidth: INPUT_BORDER_WIDTH,
  borderRadius: INPUT_BORDER_RADIUS,
  paddingLeft: INPUT_PADDING_HORIZONTAL,
  paddingRight: INPUT_PADDING_HORIZONTAL,
  paddingTop: INPUT_PADDING_VERTICAL,
  paddingBottom: INPUT_PADDING_VERTICAL,
  fontSize: INPUT_FONT_SIZE,
  lineHeight: `${INPUT_LINE_HEIGHT}px`,
  color: colors.textPrimary,
  backgroundColor: colors.surfaceAlt,
  fontFamily: 'system-ui, sans-serif',
};

export function webDateInputStyle(hasError: boolean, isFocused = false): CSSProperties {
  if (hasError) {
    return { ...webInputBase, borderColor: colors.error, outline: 'none' };
  }

  // Repõe o indicador de foco que o `outline: none` retirava (WCAG 2.4.7).
  // Só a cor muda: alterar a largura da borda deslocaria o conteúdo em 1px.
  if (isFocused) {
    return { ...webInputBase, borderColor: colors.primary, outline: 'none' };
  }

  return { ...webInputBase, borderColor: colors.border, outline: 'none' };
}
