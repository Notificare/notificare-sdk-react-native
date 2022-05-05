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
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { NotificareInbox } from 'react-native-notificare-inbox';
import { NotificareScannables } from 'react-native-notificare-scannables';
import { NotificareGeo } from 'react-native-notificare-geo';
import { BeaconsPage } from './pages/beacons-page';
import { NotificareAuthentication } from 'react-native-notificare-authentication';

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

        if (await NotificareGeo.hasLocationServicesEnabled()) {
          await NotificareGeo.enableLocationUpdates();
        }
      }),
      Notificare.onUnlaunched(() => {
        console.log('=== ON UNLAUNCHED ===');

        setSnackbarInfo({
          visible: true,
          label: `Notificare has finished un-launching.`,
        });
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
      NotificarePush.onNotificationOpened(async (notification) => {
        console.log('=== NOTIFICATION OPENED ===');
        console.log(JSON.stringify(notification, null, 2));

        await NotificarePushUI.presentNotification(notification);
      }),
      NotificarePush.onNotificationActionOpened(
        async ({ notification, action }) => {
          console.log('=== NOTIFICATION ACTION OPENED ===');
          console.log(JSON.stringify({ notification, action }, null, 2));

          await NotificarePushUI.presentAction(notification, action);
        }
      ),
      NotificarePush.onUnknownNotificationOpened((notification) => {
        console.log('=== UNKNOWN NOTIFICATION OPENED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onUnknownNotificationActionOpened((data) => {
        console.log('=== UNKNOWN NOTIFICATION ACTION OPENED ===');
        console.log(JSON.stringify(data, null, 2));
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
      //
      // Notificare Push UI events
      //
      NotificarePushUI.onNotificationWillPresent((notification) => {
        console.log('=== NOTIFICATION WILL PRESENT ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePushUI.onNotificationPresented((notification) => {
        console.log('=== NOTIFICATION PRESENTED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePushUI.onNotificationFinishedPresenting((notification) => {
        console.log('=== NOTIFICATION FINISHED PRESENTING ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePushUI.onNotificationFailedToPresent((notification) => {
        console.log('=== NOTIFICATION FAILED TO PRESENT ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePushUI.onNotificationUrlClicked(({ notification, url }) => {
        console.log('=== NOTIFICATION URL CLICKED ===');
        console.log(JSON.stringify({ notification, url }, null, 2));
      }),
      NotificarePushUI.onActionWillExecute(({ notification, action }) => {
        console.log('=== ACTION WILL EXECUTE ===');
        console.log(JSON.stringify({ notification, action }, null, 2));
      }),
      NotificarePushUI.onActionExecuted(({ notification, action }) => {
        console.log('=== ACTION EXECUTED ===');
        console.log(JSON.stringify({ notification, action }, null, 2));
      }),
      NotificarePushUI.onActionNotExecuted(({ notification, action }) => {
        console.log('=== ACTION NOT EXECUTED ===');
        console.log(JSON.stringify({ notification, action }, null, 2));
      }),
      NotificarePushUI.onActionFailedToExecute(
        ({ notification, action, error }) => {
          console.log('=== ACTION FAILED TO EXECUTE ===');
          console.log(JSON.stringify({ notification, action, error }, null, 2));
        }
      ),
      NotificarePushUI.onCustomActionReceived(
        ({ notification, action, url }) => {
          console.log('=== CUSTOM ACTION RECEIVED ===');
          console.log(JSON.stringify({ notification, action, url }, null, 2));
        }
      ),
      //
      // Notificare Inbox events
      //
      NotificareInbox.onInboxUpdated((items) => {
        console.log('=== INBOX UPDATED ===');
        console.log(JSON.stringify(items, null, 2));
      }),
      NotificareInbox.onBadgeUpdated((badge) => {
        console.log('=== BADGE UPDATED ===');
        console.log(JSON.stringify(badge, null, 2));
      }),
      //
      // Notificare Scannables events
      //
      NotificareScannables.onScannableDetected(async (scannable) => {
        console.log('=== SCANNABLE DETECTED ===');
        console.log(JSON.stringify(scannable, null, 2));

        if (scannable.notification != null) {
          await NotificarePushUI.presentNotification(scannable.notification);
        }
      }),
      NotificareScannables.onScannableSessionFailed((error) => {
        console.log('=== SCANNABLE SESSION FAILED ===');
        console.log(JSON.stringify(error, null, 2));
      }),
      //
      // Notificare Geo events
      //
      NotificareGeo.onLocationUpdated((location) => {
        console.log('=== LOCATION UPDATED ===');
        console.log(JSON.stringify(location, null, 2));
      }),
      NotificareGeo.onRegionEntered((region) => {
        console.log('=== REGION ENTERED ===');
        console.log(JSON.stringify(region, null, 2));
      }),
      NotificareGeo.onRegionExited((region) => {
        console.log('=== REGION EXITED ===');
        console.log(JSON.stringify(region, null, 2));
      }),
      NotificareGeo.onBeaconEntered((beacon) => {
        console.log('=== BEACON ENTERED ===');
        console.log(JSON.stringify(beacon, null, 2));
      }),
      NotificareGeo.onBeaconExited((beacon) => {
        console.log('=== BEACON EXITED ===');
        console.log(JSON.stringify(beacon, null, 2));
      }),
      NotificareGeo.onBeaconsRanged(({ region, beacons }) => {
        console.log('=== BEACONS RANGED ===');
        console.log(JSON.stringify({ region, beacons }, null, 2));
      }),
      NotificareGeo.onVisit((visit) => {
        console.log('=== VISIT ===');
        console.log(JSON.stringify(visit, null, 2));
      }),
      NotificareGeo.onHeadingUpdated((heading) => {
        console.log('=== HEADING UPDATED ===');
        console.log(JSON.stringify(heading, null, 2));
      }),
      //
      // Notificare Authentication events
      //
      NotificareAuthentication.onPasswordResetTokenReceived(async (token) => {
        console.log('=== PASSWORD RESET TOKEN RECEIVED ===');
        console.log(JSON.stringify(token, null, 2));

        try {
          await NotificareAuthentication.resetPassword('123456', token);
        } catch (e) {
          setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
        }
      }),
      NotificareAuthentication.onValidateUserTokenReceived(async (token) => {
        console.log('=== VALIDATE USER TOKEN RECEIVED ===');
        console.log(JSON.stringify(token, null, 2));

        try {
          await NotificareAuthentication.validateUser(token);
        } catch (e) {
          setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
        }
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
          <Stack.Screen name="Beacons" component={BeaconsPage} />
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
