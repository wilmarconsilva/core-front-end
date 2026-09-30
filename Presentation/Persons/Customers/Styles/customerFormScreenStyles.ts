import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { formScreenCommonStyles } from '../formScreenCommonStyles';

const customerOnly = StyleSheet.create({
  addressCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.surfaceAlt,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export const customerFormScreenStyles = {
  ...formScreenCommonStyles,
  ...customerOnly,
};
