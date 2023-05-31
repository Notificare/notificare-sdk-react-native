import React, { createContext, FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { HomeView } from './pages/home/home_view';
import { InboxView } from './pages/inbox/inbox_view';
import { Notificare } from 'react-native-notificare';
import { SnackbarInfo } from './utils/snackbar';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { NotificareInbox } from 'react-native-notificare-inbox';
import { NotificareScannables } from 'react-native-notificare-scannables';
import { NotificareGeo } from 'react-native-notificare-geo';
import { BeaconsView } from './pages/beacons/beacons_view';
import { NotificareMonetize } from 'react-native-notificare-monetize';
import { NotificareInAppMessaging } from 'react-native-notificare-in-app-messaging';
import { DeviceView } from './pages/device/device_view';
import { TagsView } from './pages/tags/tags_view';
import { AssetsView } from './pages/assets/assets_view';
import { CustomEventView } from './pages/events/custom_events_view';
import { MonetizeView } from './pages/monetize/monetize_view';
import { ScannablesView } from './pages/scannables/scannables_view';
import { snackbarStyles } from './styles/styles_snackbar';

const Stack = createNativeStackNavigator();

const mainContext = createContext({
  isReady: false,
  notificationsSettingsGranted: false,
  badge: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSnackbarInfoMessage: (info: SnackbarInfo) => {},
});

export default mainContext;

export const App: FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [notificationsSettingsGranted, setNotificationsSettingsGranted] =
    useState(false);
  const [badge, setBadge] = useState(0);
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({
    type: 'idle',
  });
  const [snackbarInfoMessages, setSnackbarInfoMessages] = useState<
    SnackbarInfo[]
  >([]);

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
        setIsReady(true);
        setBadge(await NotificareInbox.getBadge());
        console.log('=== ON READY ===');
        console.log(JSON.stringify(application, null, 2));

        setSnackbarInfo({
          message: `Notificare is ready: ${application.name}`,
          type: 'idle',
        });

        if (await NotificarePush.hasRemoteNotificationsEnabled()) {
          await NotificarePush.enableRemoteNotifications();
        }

        if (await NotificareGeo.hasLocationServicesEnabled()) {
          await NotificareGeo.enableLocationUpdates();
        }
      }),
      Notificare.onUnlaunched(() => {
        setIsReady(false);
        console.log('=== ON UNLAUNCHED ===');

        addSnackbarInfoMessage({
          message: `Notificare has finished un-launching.`,
          type: 'idle',
        });
      }),
      Notificare.onDeviceRegistered((device) => {
        console.log('=== DEVICE REGISTERED ===');
        console.log(JSON.stringify(device, null, 2));

        addSnackbarInfoMessage({
          message: `Device registered: ${device.id}`,
          type: 'idle',
        });
      }),
      Notificare.onUrlOpened((url) => {
        console.log('=== URL OPENED ===');
        console.log(JSON.stringify(url, null, 2));

        addSnackbarInfoMessage({
          message: `URL opened: ${url}`,
          type: 'idle',
        });
      }),
      //
      // Notificare Push events
      //
      NotificarePush.onNotificationInfoReceived(
        ({ notification, deliveryMechanism }) => {
          console.log('=== NOTIFICATION RECEIVED ===');
          console.log(JSON.stringify(notification, null, 2));
          console.log(deliveryMechanism);
        }
      ),
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
        setNotificationsSettingsGranted(granted);

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
      NotificareInbox.onBadgeUpdated((result) => {
        setBadge(result);

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
      // Notificare Monetize
      //
      NotificareMonetize.onBillingSetupFinished(() => {
        console.log('=== BILLING SETUP FINISHED ===');
      }),
      NotificareMonetize.onBillingSetupFailed(({ code, message }) => {
        console.log('=== BILLING SETUP FAILED ===');
        console.log(JSON.stringify({ code, message }, null, 2));
      }),
      NotificareMonetize.onProductsUpdated((products) => {
        console.log('=== PRODUCTS UPDATED ===');
        console.log(JSON.stringify(products, null, 2));
      }),
      NotificareMonetize.onPurchasesUpdated((purchases) => {
        console.log('=== PURCHASES UPDATED ===');
        console.log(JSON.stringify(purchases, null, 2));
      }),
      NotificareMonetize.onPurchaseFinished((purchase) => {
        console.log('=== PURCHASE FINISHED ===');
        console.log(JSON.stringify(purchase, null, 2));
      }),
      NotificareMonetize.onPurchaseRestored((purchase) => {
        console.log('=== PURCHASE RESTORED ===');
        console.log(JSON.stringify(purchase, null, 2));
      }),
      NotificareMonetize.onPurchaseCanceled(() => {
        console.log('=== PURCHASE CANCELED ===');
      }),
      NotificareMonetize.onPurchaseFailed(({ code, message, errorMessage }) => {
        console.log('=== PURCHASE FAILED ===');
        console.log(JSON.stringify({ code, message, errorMessage }, null, 2));
      }),
      //
      // Notificare In-App Messaging
      //
      NotificareInAppMessaging.onMessagePresented((message) => {
        console.log('=== ON MESSAGE PRESENTED ===');
        console.log(JSON.stringify(message, null, 2));
      }),
      NotificareInAppMessaging.onMessageFinishedPresenting((message) => {
        console.log('=== ON MESSAGE FINISHED PRESENTING ===');
        console.log(JSON.stringify(message, null, 2));
      }),
      NotificareInAppMessaging.onMessageFailedToPresent((message) => {
        console.log('=== ON MESSAGE FAILED TO PRESENT ===');
        console.log(JSON.stringify(message, null, 2));
      }),
      NotificareInAppMessaging.onActionExecuted((data) => {
        console.log('=== ON ACTION EXECUTED ===');
        console.log(JSON.stringify(data, null, 2));
      }),
      NotificareInAppMessaging.onActionFailedToExecute((data) => {
        console.log('=== ON ACTION FAILED TO EXECUTE ===');
        console.log(JSON.stringify(data, null, 2));
      }),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  });

  useEffect(
    function processActionStatusMessages() {
      if (
        snackbarInfoMessages.length > 0 &&
        snackbarInfo.message === undefined
      ) {
        setSnackbarInfo(snackbarInfoMessages[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snackbarInfoMessages]
  );

  function addSnackbarInfoMessage(info: SnackbarInfo) {
    if (snackbarInfoMessages.length > 0) {
      snackbarInfoMessages.push(info);

      return;
    }

    setSnackbarInfoMessages((prevState) => [...prevState, info]);
  }

  function removeSnackbarInfoMessages() {
    setSnackbarInfoMessages((prevState) => prevState.slice(1));
  }

  function resetSnackbar() {
    setSnackbarInfo({ type: 'idle' });

    setTimeout(() => {
      removeSnackbarInfoMessages();
    }, 500);
  }

  return (
    <PaperProvider>
      <mainContext.Provider
        value={{
          isReady,
          notificationsSettingsGranted,
          badge,
          addSnackbarInfoMessage,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Sample">
            <Stack.Screen name="Sample" component={HomeView} />
            <Stack.Screen name="Device" component={DeviceView} />
            <Stack.Screen name="Inbox" component={InboxView} />
            <Stack.Screen name="Tags" component={TagsView} />
            <Stack.Screen name="Beacons" component={BeaconsView} />
            <Stack.Screen name="Scannables" component={ScannablesView} />
            <Stack.Screen name="Assets" component={AssetsView} />
            <Stack.Screen name="Monetize" component={MonetizeView} />
            <Stack.Screen name="Custom Event" component={CustomEventView} />
          </Stack.Navigator>
        </NavigationContainer>

        <Snackbar
          visible={snackbarInfo.message !== undefined}
          onDismiss={resetSnackbar}
          style={[
            snackbarInfo.type === 'idle' && snackbarStyles.standard,
            snackbarInfo.type === 'success' && snackbarStyles.success,
            snackbarInfo.type === 'error' && snackbarStyles.error,
          ]}
          duration={snackbarInfo.type === 'error' ? 3000 : 1500}
        >
          {snackbarInfo.message}
        </Snackbar>
      </mainContext.Provider>
    </PaperProvider>
  );
};
