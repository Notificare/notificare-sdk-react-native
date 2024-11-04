import { StyleSheet } from 'react-native';

export const beaconsStyles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const beaconDetailsStyles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },

  title: {
    fontSize: 14,
    fontWeight: 'normal',
  },

  message: {
    fontSize: 12,
    fontWeight: 'normal',
  },

  caption: {
    fontSize: 10,
    fontWeight: 'normal',
  },
});
