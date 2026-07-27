import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const signatureCanvasStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLabel,
    marginBottom: 6,
  },
  instructions: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  canvasWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },
  clearText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  unsupported: {
    padding: 16,
    alignItems: 'center',
  },
  unsupportedText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
