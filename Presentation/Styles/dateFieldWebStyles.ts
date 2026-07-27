import type { CSSProperties } from 'react';
import { colors } from './colors';

const webInputBase: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 8,
  paddingLeft: 14,
  paddingRight: 14,
  paddingTop: 12,
  paddingBottom: 12,
  fontSize: 15,
  color: colors.textPlaceholder,
  backgroundColor: colors.surfaceAlt,
  outline: 'none',
  fontFamily: 'system-ui, sans-serif',
};

export function webDateInputStyle(hasError: boolean): CSSProperties {
  return {
    ...webInputBase,
    borderColor: hasError ? colors.error : colors.border,
  };
}
