import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { ViewStyle } from 'react-native';

const container: ViewStyle = {
    flexGrow: 1,
    padding: 24,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
};

const elevatedSectionCard: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: 12,
  padding: 16,
  width: '100%',
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

export const layoutStyles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    ...container,
    justifyContent: 'flex-start'
  },
  loginContainer: {
    ...container,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionCard: elevatedSectionCard,
  /** Como sectionCard, com espaçamento inferior (relatórios, cartões empilhados). */
  sectionCardSpaced: {
    ...elevatedSectionCard,
    marginBottom: 16,
  },
});
