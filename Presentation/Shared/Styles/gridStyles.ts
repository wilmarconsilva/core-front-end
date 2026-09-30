import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { ViewStyle } from 'react-native';

const menuItem: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
};

export const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  menuItemMedium: {
    ...menuItem,
    width: '48%',
  },
  menuItemLarge: {
    ...menuItem,
    width: '100%',
  },
  menuItemIcon: {
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
