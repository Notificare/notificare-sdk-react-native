import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Badge } from 'react-native-paper';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import { NotificarePush } from 'react-native-notificare-push';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { useSnackbarContext } from '../../../contexts/snackbar';

type RemoteNotificationsCardProps = {
  badge: number;
};

export const RemoteNotificationsCardView = (
  props: RemoteNotificationsCardProps
) => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
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

      Alert.alert(
        'Notifications Status',
        `allowedUi: ${allowedUi}
hasRemoteNotificationsEnabled: ${hasRemoteNotificationsEnabled}`,
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

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Remote Notifications</Text>

        <TouchableOpacity onPress={showNotificationsStatusInfo}>
          <MaterialIcons name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.row}>
          <MaterialIcons name="notifications" size={18} />

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
            <MaterialIcons name="inbox" size={18} />

            <Text style={mainStyles.subtitle}>Inbox</Text>

            <Badge style={mainStyles.badge} visible={props.badge > 0}>
              {props.badge}
            </Badge>

            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              color="#00000026"
            />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
