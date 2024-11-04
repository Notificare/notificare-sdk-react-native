import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  NotificareInbox,
  NotificareInboxItem,
} from 'react-native-notificare-inbox';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { useNavigation } from '@react-navigation/native';
import { useSnackbarContext } from '@/components/contexts/snackbar';
import { bottomSheetStyles } from '@/styles/styles-bottom-sheet';
import { InboxItem } from '@/components/inbox/inbox-item';
import { inboxStyles } from '@/styles/styles-inbox';

export default function InboxScreen() {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const navigation = useNavigation();
  const [items, setItems] = useState<NotificareInboxItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NotificareInboxItem | null>(
    null
  );

  useEffect(
    function loadInboxItems() {
      (async () => {
        try {
          setItems(await NotificareInbox.getItems());
        } catch (e) {
          console.log('=== Error getting inbox items ===');
          console.log(JSON.stringify(e));

          addSnackbarInfoMessage({
            message: 'Error getting inbox items.',
            type: 'error',
          });
        }
      })();
    },
    [addSnackbarInfoMessage]
  );

  useEffect(function setupListeners() {
    const subscriptions = [NotificareInbox.onInboxUpdated(setItems)];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  useLayoutEffect(function setupToolbarActions() {
    navigation.setOptions({
      headerRight: () => (
        <>
          <MaterialIcons.Button
            name="sync"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            style={inboxStyles.toolbarAction}
            onPress={refresh}
          />

          <MaterialIcons.Button
            name="mark-email-read"
            style={inboxStyles.toolbarAction}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            onPress={markAllAsRead}
          />

          <MaterialIcons.Button
            style={inboxStyles.toolbarAction}
            name="delete-sweep"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            onPress={clear}
          />
        </>
      ),
    });
  });

  async function open(item: NotificareInboxItem) {
    try {
      const notification = await NotificareInbox.open(item);
      await NotificarePushUI.presentNotification(notification);
      console.log('=== Notification opened and presented successfully ===');

      addSnackbarInfoMessage({
        message: 'Notification opened and presented successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error opening or presenting notification ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error opening or presenting notification.',
        type: 'error',
      });
    }
  }

  async function markAsRead(item: NotificareInboxItem) {
    try {
      await NotificareInbox.markAsRead(item);
      console.log('=== Marked as read successfully ===');

      addSnackbarInfoMessage({
        message: 'Marked as read successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error marked as read ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error marked as read.',
        type: 'error',
      });
    }
  }

  async function remove(item: NotificareInboxItem) {
    try {
      await NotificareInbox.remove(item);
      console.log('=== Removed successfully ===');

      addSnackbarInfoMessage({
        message: 'Removed successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error removing inbox item ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error removing inbox item.',
        type: 'error',
      });
    }
  }

  async function refresh() {
    try {
      await NotificareInbox.refresh();
      console.log('=== Inbox refreshed successfully ===');

      addSnackbarInfoMessage({
        message: 'Inbox refreshed successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error refresh inbox ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error refresh inbox.',
        type: 'error',
      });
    }
  }

  async function markAllAsRead() {
    try {
      await NotificareInbox.markAllAsRead();
      console.log('=== Marked all as read successfully ===');

      addSnackbarInfoMessage({
        message: 'Marked all as read successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error mark all as read ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error mark all as read.',
        type: 'error',
      });
    }
  }

  async function clear() {
    try {
      await NotificareInbox.clear();
      console.log('=== Cleared inbox successfully ===');

      addSnackbarInfoMessage({
        message: 'Cleared inbox successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Error clear inbox ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error clear inbox.',
        type: 'error',
      });
    }
  }

  async function onBottomSheetActionClicked(
    action: InboxBottomSheetActions['action']
  ) {
    if (selectedItem === null) {
      return;
    }

    const item = selectedItem;
    setSelectedItem(null);

    switch (action) {
      case 'open':
        await open(item);
        break;
      case 'markAsRead':
        await markAsRead(item);
        break;
      case 'remove':
        await remove(item);
        break;
      case 'cancel':
        break;
    }
  }

  return (
    <>
      {items.length === 0 && (
        <View style={inboxStyles.emptyStateContainer}>
          <Text>You have no messages</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => open(item)}
              onLongPress={() => setSelectedItem(item)}
            >
              <View>
                <InboxItem item={item} />
              </View>
            </TouchableWithoutFeedback>
          )}
          // Temporary workaround for https://github.com/software-mansion/react-native-screens/issues/2282
          removeClippedSubviews={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedItem !== null}
        onTouchEnd={() => onBottomSheetActionClicked('cancel')}
      >
        <Pressable
          style={bottomSheetStyles.overlay}
          onPress={() => onBottomSheetActionClicked('cancel')}
        />

        <View>
          <View style={bottomSheetStyles.bottomSheet}>
            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('open')}
            >
              <Text>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('markAsRead')}
            >
              <Text>Mark as Read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={bottomSheetStyles.button}
              onPress={() => onBottomSheetActionClicked('remove')}
            >
              <Text>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[bottomSheetStyles.button]}
              onPress={() => onBottomSheetActionClicked('cancel')}
            >
              <Text style={[bottomSheetStyles.buttonCancel]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

interface InboxBottomSheetActions {
  action: 'open' | 'markAsRead' | 'remove' | 'cancel';
}
