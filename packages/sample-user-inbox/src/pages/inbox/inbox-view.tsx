import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  NotificareUserInbox,
  NotificareUserInboxItem,
} from 'react-native-notificare-user-inbox';
import { InboxItem } from './views/inbox-item';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { inboxStyles } from '../../styles/styles-inbox';
import { bottomSheetStyles } from '../../styles/styles-bottom-sheet';
import { useSnackbarContext } from '../../contexts/snackbar';
import { getUserInboxResponse } from '../../network/user-inbox-request';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
import { NotificarePush } from 'react-native-notificare-push';

export const InboxView = () => {
  const { getCredentials, hasValidCredentials } = useAuth0();
  const navigation = useNavigation();
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [items, setItems] = useState<NotificareUserInboxItem[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<NotificareUserInboxItem | null>(null);

  const refresh = useCallback(async () => {
    try {
      if (!(await hasValidCredentials())) {
        throw new Error('No valid credentials found .');
      }

      const credentials = await getCredentials();
      if (!credentials) {
        throw new Error('Undefined credentials.');
      }

      const requestResponseStr = await getUserInboxResponse(
        credentials.accessToken
      );

      const userInboxResponse =
        await NotificareUserInbox.parseResponseFromString(requestResponseStr);

      setItems(userInboxResponse.items);
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
  }, [addSnackbarInfoMessage, getCredentials, hasValidCredentials]);

  useEffect(
    function loadInboxItems() {
      (async () => await refresh())();
    },
    [refresh]
  );

  useEffect(
    function setupListeners() {
      const subscriptions = [
        NotificarePush.onNotificationOpened(async (_) => {
          await refresh();
        }),

        NotificarePush.onNotificationInfoReceived(async (_) => {
          await refresh();
        }),
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [refresh]
  );

  useLayoutEffect(function setupToolbarActions() {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Icon.Button
            name="sync"
            backgroundColor="transparent"
            underlayColor="transparent"
            color="black"
            style={inboxStyles.toolbarAction}
            onPress={refresh}
          />
        </>
      ),
    });
  });

  async function open(item: NotificareUserInboxItem) {
    try {
      const notification = await NotificareUserInbox.open(item);
      await NotificarePushUI.presentNotification(notification);
      console.log('=== Notification opened and presented successfully ===');

      addSnackbarInfoMessage({
        message: 'Notification opened and presented successfully.',
        type: 'success',
      });

      if (!item.opened) {
        await refresh();
      }
    } catch (e) {
      console.log('=== Error opening or presenting notification ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error opening or presenting notification.',
        type: 'error',
      });
    }
  }

  async function markAsRead(item: NotificareUserInboxItem) {
    try {
      await NotificareUserInbox.markAsRead(item);
      console.log('=== Marked as read successfully ===');

      addSnackbarInfoMessage({
        message: 'Marked as read successfully.',
        type: 'success',
      });

      if (!item.opened) {
        await refresh();
      }
    } catch (e) {
      console.log('=== Error marked as read ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error marked as read.',
        type: 'error',
      });
    }
  }

  async function remove(item: NotificareUserInboxItem) {
    try {
      await NotificareUserInbox.remove(item);
      console.log('=== Removed successfully ===');

      addSnackbarInfoMessage({
        message: 'Removed successfully.',
        type: 'success',
      });

      await refresh();
    } catch (e) {
      console.log('=== Error removing inbox item ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error removing inbox item.',
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
};

interface InboxBottomSheetActions {
  action: 'open' | 'markAsRead' | 'remove' | 'cancel';
}
