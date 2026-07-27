import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typographyStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
