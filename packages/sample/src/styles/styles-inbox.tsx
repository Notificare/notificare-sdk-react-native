import { StyleSheet } from 'react-native';

export const inboxStyles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolbarAction: {
    padding: 0,
  },
});

export const inboxItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },

  attachmentContainer: {
    marginRight: 16,
  },

  detailsContainer: {
    flex: 1,
    flexGrow: 1,
  },

  unreadContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
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

  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#2B43F7',
    marginTop: 8,
  },

  emptyAttachment: {
    backgroundColor: '#e3e3e3',
    width: 64,
    height: 42,
  },

  emptyView: {
    flex: 1,
  },
});
