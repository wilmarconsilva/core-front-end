import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const checkboxFieldStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
});
