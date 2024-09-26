import { ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LaunchFlowCard } from './views/launch-flow-card-view';
import { RemoteNotificationsCardView } from './views/remote-notifications-card-view';
import { DnDNotificationsCardView } from './views/dnd-card-view';
import { mainStyles } from '../../styles/styles';
import { Notificare } from 'react-native-notificare';
import { useSnackbarContext } from '../../contexts/snackbar';
import { useAuth0 } from 'react-native-auth0';
import { NotificareUserInbox } from 'react-native-notificare-user-inbox';
import {
  getUserInboxResponse,
  registerDeviceAsAnonymous,
  registerDeviceWithUser,
} from '../../network/user-inbox-request';
import { NotificarePush } from 'react-native-notificare-push';
import { AuthenticationCardView } from './views/authentication-card-view';
import { useFocusEffect } from '@react-navigation/native';

export const HomeView = () => {
  const {
    authorize,
    clearSession,
    getCredentials,
    hasValidCredentials,
    clearCredentials,
  } = useAuth0();

  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [isReady, setIsReady] = useState(false);
  const [badge, setBadge] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

  const refreshBadge = useCallback(async () => {
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

      setBadge(userInboxResponse.unread);
      console.log('=== Badge refreshed successfully ===');

      addSnackbarInfoMessage({
        message: 'Badge refreshed successfully.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Failed to refresh badge===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Failed to refresh badge.',
        type: 'error',
      });
    }
  }, [addSnackbarInfoMessage, getCredentials, hasValidCredentials]);

  const startAutoLoginFlow = useCallback(async () => {
    try {
      if (!(await hasValidCredentials())) {
        throw new Error('No valid credentials found .');
      }

      const credentials = await getCredentials();
      if (!credentials) {
        throw new Error('Undefined credentials.');
      }

      setIsLoggedIn(true);

      await registerDeviceWithUser(credentials.accessToken);
      setIsDeviceRegistered(true);
      console.log('=== Register device success ===');

      await refreshBadge();

      console.log('=== Auto login flow success ===');
    } catch (e) {
      console.log('=== Failed to auto login ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Failed to auto login.',
        type: 'error',
      });
    }
  }, [
    addSnackbarInfoMessage,
    getCredentials,
    hasValidCredentials,
    refreshBadge,
  ]);

  async function startLoginFlow() {
    console.log('=== Login flow start===');

    try {
      const credentials = await authorize();

      if (!credentials) {
        throw new Error('Undefined credentials.');
      }

      setIsLoggedIn(true);
      console.log('=== Get credentials success ===');

      await registerDeviceWithUser(credentials.accessToken);
      setIsDeviceRegistered(true);
      console.log('=== Register device success ===');

      await refreshBadge();

      console.log('=== Login flow success ===');
    } catch (e) {
      console.log('=== Login flow failed ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Login flow failed .',
        type: 'error',
      });
    }
  }

  async function startLogoutFlow() {
    try {
      if (!(await hasValidCredentials())) {
        throw new Error('No valid credentials found .');
      }

      const credentials = await getCredentials();
      if (!credentials) {
        throw new Error('Undefined credentials.');
      }

      await clearCredentials();
      console.log('=== Credentials clear success ===');

      await clearSession();

      setIsLoggedIn(false);
      console.log('=== Session clear success ===');

      await registerDeviceAsAnonymous(credentials.accessToken);
      setIsDeviceRegistered(false);
      console.log('=== Device registered as anonymous ===');

      setBadge(0);

      console.log('=== Logout success ===');
      addSnackbarInfoMessage({
        message: 'Logout success.',
        type: 'success',
      });
    } catch (e) {
      console.log('=== Failed to logout ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Failed to logout.',
        type: 'error',
      });
    }
  }

  useEffect(
    function setupListeners() {
      const subscriptions = [
        Notificare.onReady(async (_) => {
          setIsReady(true);

          await startAutoLoginFlow();
        }),

        Notificare.onUnlaunched(() => {
          setIsReady(false);
        }),

        NotificarePush.onNotificationOpened(async (_) => {
          await refreshBadge();
        }),

        NotificarePush.onNotificationInfoReceived(async (_) => {
          await refreshBadge();
        }),
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [refreshBadge, startAutoLoginFlow]
  );

  useFocusEffect(
    React.useCallback(() => {
      refreshBadge();
    }, [refreshBadge])
  );

  return (
    <ScrollView>
      <View style={mainStyles.main_view_container}>
        <LaunchFlowCard isReady={isReady} />

        {isReady && (
          <>
            <AuthenticationCardView
              isLoggedIn={isLoggedIn}
              isDeviceRegistered={isDeviceRegistered}
              startLoginFLow={startLoginFlow}
              startLogoutFlow={startLogoutFlow}
            />

            <RemoteNotificationsCardView badge={badge} />

            <DnDNotificationsCardView />
          </>
        )}
      </View>
    </ScrollView>
  );
};
