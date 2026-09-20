/**
 * Tokens da caixa de input, compartilhados entre StyleSheet (React Native)
 * e CSSProperties (elementos DOM crus, como o <input type="date"> do DateField).
 *
 * Existem para que os dois mundos não divirjam: o DateField é o único campo
 * renderizado fora do React Native e precisa alinhar com os demais.
 */

/** >= 16px evita o auto-zoom do iOS Safari ao focar um campo. */
export const INPUT_FONT_SIZE = 16;
export const INPUT_LINE_HEIGHT = 20;
export const INPUT_PADDING_HORIZONTAL = 14;
export const INPUT_PADDING_VERTICAL = 12;
export const INPUT_BORDER_WIDTH = 1;
export const INPUT_BORDER_RADIUS = 8;

/** Altura fixa para que DateField (DOM) e FormField (RN) alinhem na mesma linha. */
export const INPUT_HEIGHT =
  INPUT_LINE_HEIGHT + INPUT_PADDING_VERTICAL * 2 + INPUT_BORDER_WIDTH * 2;

/** Alvo mínimo de toque: Apple HIG pede 44pt; WCAG 2.2 SC 2.5.8 pede 24px. */
export const TOUCH_TARGET_MIN = 44;
