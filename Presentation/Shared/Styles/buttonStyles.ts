import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.45,
  },
  baseText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },

  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.textWhite,
    fontWeight: '600',
  },

  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
