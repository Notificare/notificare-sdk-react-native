import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Badge } from 'react-native-paper';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import { NotificarePush } from 'react-native-notificare-push';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { NotificareInbox } from 'react-native-notificare-inbox';
import { useSnackbarContext } from '../../../contexts/snackbar';

export const RemoteNotificationsCardView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [badge, setBadge] = useState(0);
  const [hasNotificationsEnabled, setHasNotificationsEnabled] = useState(false);
  const navigation = useNavigation();

  const checkNotificationsStatus = useCallback(async () => {
    try {
      const enabled =
        (await NotificarePush.hasRemoteNotificationsEnabled()) &&
        (await NotificarePush.allowedUI());

      setHasNotificationsEnabled(enabled);
    } catch (e) {
      console.log('=== Error checking remote notifications status ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error checking remote notifications status.',
        type: 'error',
      });
    }
  }, [addSnackbarInfoMessage]);

  useEffect(
    function setupListeners() {
      const subscriptions = [
        NotificareInbox.onBadgeUpdated((result) => {
          setBadge(result);
        }),

        NotificarePush.onNotificationSettingsChanged(async (_) => {
          await checkNotificationsStatus();
        }),
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [checkNotificationsStatus]
  );

  useEffect(
    function checkInitialStatus() {
      (async () => {
        await checkNotificationsStatus();
      })();
    },
    [checkNotificationsStatus]
  );

  useEffect(
    function getBadge() {
      (async () => {
        try {
          const result = await NotificareInbox.getBadge();

          setBadge(result);
        } catch (e) {
          console.log('=== Error getting badge ===');
          console.log(JSON.stringify(e));

          addSnackbarInfoMessage({
            message: 'Error getting badge.',
            type: 'error',
          });
        }
      })();
    },
    [addSnackbarInfoMessage]
  );

  async function updateNotificationsStatus(enabled: boolean) {
    setHasNotificationsEnabled(enabled);

    if (!enabled) {
      try {
        console.log('=== Disabling remote notifications ===');
        await NotificarePush.disableRemoteNotifications();

        console.log('=== Disabling remote notifications finished ===');
        addSnackbarInfoMessage({
          message: 'Disabled remote notifications successfully.',
          type: 'success',
        });
      } catch (e) {
        console.log('=== Error disabling remote notifications ===');
        console.log(JSON.stringify(e));

        addSnackbarInfoMessage({
          message: 'Error disabling remote notifications.',
          type: 'error',
        });
      }

      return;
    }

    try {
      if (await ensureNotificationsPermission()) {
        console.log('=== Enabling remote notifications ===');
        await NotificarePush.enableRemoteNotifications();

        console.log('=== Enabling remote notifications finished ===');
        addSnackbarInfoMessage({
          message: 'Enabled remote notifications successfully.',
          type: 'success',
        });

        return;
      }
    } catch (e) {
      console.log('=== Error enabling remote notifications ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error enabling remote notifications.',
        type: 'error',
      });
    }

    setHasNotificationsEnabled(false);
  }

  async function ensureNotificationsPermission(): Promise<boolean> {
    let result = await checkNotifications();
    if (result.status === 'granted') return true;

    result = await requestNotifications(['alert', 'badge', 'sound']);
    return result.status === 'granted';
  }

  async function showNotificationsStatusInfo() {
    try {
      const allowedUi = await NotificarePush.allowedUI();
      const hasRemoteNotificationsEnabled =
        await NotificarePush.hasRemoteNotificationsEnabled();
      const transport = await NotificarePush.transport();
      const subscriptionId = await NotificarePush.subscriptionId();

      Alert.alert(
        'Notifications Status',
        `allowedUi: ${allowedUi}
hasRemoteNotificationsEnabled: ${hasRemoteNotificationsEnabled}
transport: ${transport}
subscriptionId: ${subscriptionId}`,
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      );
    } catch (e) {
      console.log(
        '=== Error getting allowedUi / hasRemoteNotificationsEnabled ==='
      );
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error getting allowedUi / hasRemoteNotificationsEnabled.',
        type: 'error',
      });
    }
  }

  function onInboxClicked() {
    // @ts-ignore
    navigation.navigate('Inbox');
  }

  function onTagsClicked() {
    // @ts-ignore
    navigation.navigate('Tags');
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Remote Notifications</Text>

        <TouchableOpacity onPress={showNotificationsStatusInfo}>
          <Icon name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.row}>
          <Icon name="notifications" size={18} />

          <Text style={mainStyles.subtitle}>Notifications</Text>

          <Switch
            style={mainStyles.switch}
            value={hasNotificationsEnabled}
            onValueChange={updateNotificationsStatus}
          />
        </View>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onInboxClicked}>
          <View style={mainStyles.row}>
            <Icon name="inbox" size={18} />

            <Text style={mainStyles.subtitle}>Inbox</Text>

            <Badge style={mainStyles.badge} visible={badge > 0}>
              {badge}
            </Badge>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onTagsClicked}>
          <View style={mainStyles.row}>
            <Icon name="tag" size={18} />

            <Text style={mainStyles.subtitle}>Tags</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
