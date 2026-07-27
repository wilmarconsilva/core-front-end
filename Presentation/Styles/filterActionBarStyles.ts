import { StyleSheet } from 'react-native';

export const filterActionBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filters: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
