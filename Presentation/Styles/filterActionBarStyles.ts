import { StyleSheet } from 'react-native';

export const filterActionBarStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  btn: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
