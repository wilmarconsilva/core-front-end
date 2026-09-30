import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const appToastStyles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    marginTop: 1,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  text1: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  text2: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
