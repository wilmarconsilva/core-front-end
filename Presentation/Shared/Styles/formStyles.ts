import { StyleSheet } from 'react-native';
import { colors } from './colors';
import {
  INPUT_BORDER_RADIUS,
  INPUT_BORDER_WIDTH,
  INPUT_FONT_SIZE,
  INPUT_PADDING_HORIZONTAL,
  INPUT_PADDING_VERTICAL,
} from './inputTokens';

export const formStyles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLabel,
    marginBottom: 6,
  },
  input: {
    borderWidth: INPUT_BORDER_WIDTH,
    borderColor: colors.border,
    borderRadius: INPUT_BORDER_RADIUS,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    paddingVertical: INPUT_PADDING_VERTICAL,
    fontSize: INPUT_FONT_SIZE,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: INPUT_BORDER_WIDTH,
    borderColor: colors.border,
    borderRadius: INPUT_BORDER_RADIUS,
    backgroundColor: colors.surfaceAlt,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    paddingVertical: INPUT_PADDING_VERTICAL,
    fontSize: INPUT_FONT_SIZE,
    color: colors.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
});
