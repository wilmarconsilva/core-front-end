import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const breadcrumbStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  item: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemActive: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  separator: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginHorizontal: 6,
  },
});
