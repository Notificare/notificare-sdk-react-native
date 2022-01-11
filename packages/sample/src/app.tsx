/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { HomePage } from './pages/home-page';
import { InboxPage } from './pages/inbox-page';
import { Notificare } from 'react-native-notificare';
import { SnackbarInfo } from './utils/snackbar';
import { NotificarePush } from 'react-native-notificare-push';

const Stack = createNativeStackNavigator();

export const App: FC = () => {
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({
    visible: false,
  });

  useEffect(function launch() {
    (async () => {
      await NotificarePush.setPresentationOptions(['banner', 'badge', 'sound']);
      await Notificare.launch();
    })();
  }, []);

  useEffect(function setupListeners() {
    const subscriptions = [
      //
      // Notificare events
      //
      Notificare.onReady(async (application) => {
        console.log('=== ON READY ===');
        console.log(JSON.stringify(application, null, 2));

        setSnackbarInfo({
          visible: true,
          label: `Notificare is ready: ${application.name}`,
        });

        if (await NotificarePush.hasRemoteNotificationsEnabled()) {
          await NotificarePush.enableRemoteNotifications();
        }
      }),
      Notificare.onDeviceRegistered((device) => {
        console.log('=== DEVICE REGISTERED ===');
        console.log(JSON.stringify(device, null, 2));

        setSnackbarInfo({
          visible: true,
          label: `Device registered: ${device.id}`,
        });
      }),
      Notificare.onUrlOpened((url) => {
        console.log('=== URL OPENED ===');
        console.log(JSON.stringify(url, null, 2));

        setSnackbarInfo({
          visible: true,
          label: `URL opened: ${url}`,
        });
      }),
      //
      // Notificare Push events
      //
      NotificarePush.onNotificationReceived((notification) => {
        console.log('=== NOTIFICATION RECEIVED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onSystemNotificationReceived((notification) => {
        console.log('=== SYSTEM NOTIFICATION RECEIVED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onUnknownNotificationReceived((notification) => {
        console.log('=== UNKNOWN NOTIFICATION RECEIVED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onNotificationOpened((notification) => {
        console.log('=== NOTIFICATION OPENED ===');
        console.log(JSON.stringify(notification, null, 2));

        // TODO present it
      }),
      NotificarePush.onNotificationActionOpened(({ notification, action }) => {
        console.log('=== NOTIFICATION ACTION OPENED ===');
        console.log(JSON.stringify({ notification, action }, null, 2));

        // TODO present it
      }),
      NotificarePush.onNotificationSettingsChanged((granted) => {
        console.log('=== NOTIFICATION SETTINGS CHANGED ===');
        console.log(JSON.stringify(granted, null, 2));
      }),
      NotificarePush.onShouldOpenNotificationSettings((notification) => {
        console.log('=== SHOULD OPEN NOTIFICATION SETTINGS ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onFailedToRegisterForRemoteNotifications((error) => {
        console.log('=== FAILED TO REGISTER FOR REMOTE NOTIFICATIONS ===');
        console.log(JSON.stringify(error, null, 2));
      }),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Inbox" component={InboxPage} />
        </Stack.Navigator>
      </NavigationContainer>

      <Snackbar
        visible={snackbarInfo.visible}
        onDismiss={() => setSnackbarInfo({ visible: false })}
      >
        {snackbarInfo.label}
      </Snackbar>
    </PaperProvider>
  );
};
