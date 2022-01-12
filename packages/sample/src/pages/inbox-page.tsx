import {
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import {
  NotificareInbox,
  NotificareInboxItem,
} from 'react-native-notificare-inbox';
import { InboxItem } from '../components/inbox-item';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const InboxPage: FC = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<NotificareInboxItem[]>([]);

  useEffect(function loadInboxItems() {
    (async () => {
      setItems(await NotificareInbox.getItems());
    })();
  }, []);

  useEffect(function setupListeners() {
    const subscriptions = [NotificareInbox.onInboxUpdated(setItems)];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useLayoutEffect(
    function setupToolbarActions() {
      navigation.setOptions({
        headerRight: () => (
          <>
            <Icon.Button
              name="sync"
              backgroundColor="transparent"
              underlayColor="transparent"
              color="black"
              style={styles.toolbarAction}
              onPress={refresh}
            />
            <Icon.Button
              name="mark-email-read"
              style={styles.toolbarAction}
              backgroundColor="transparent"
              underlayColor="transparent"
              color="black"
              onPress={markAllAsRead}
            />
            <Icon.Button
              style={styles.toolbarAction}
              name="delete-sweep"
              backgroundColor="transparent"
              underlayColor="transparent"
              color="black"
              onPress={clear}
            />
          </>
        ),
      });
    },
    [navigation]
  );

  async function open(item: NotificareInboxItem) {
    const notification = await NotificareInbox.open(item);
    await NotificarePushUI.presentNotification(notification);
  }

  async function refresh() {
    await NotificareInbox.refresh();
  }

  async function markAllAsRead() {
    await NotificareInbox.markAllAsRead();
  }

  async function clear() {
    await NotificareInbox.clear();
  }

  return (
    <>
      {items.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Text>You have no messages</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => open(item)}>
              <View>
                <InboxItem item={item} />
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarAction: {
    padding: 0,
  },
});
