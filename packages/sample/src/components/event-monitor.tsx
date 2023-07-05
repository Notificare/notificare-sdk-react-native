import { useEffect } from 'react';
import { Notificare } from 'react-native-notificare';
import { NotificareInbox } from 'react-native-notificare-inbox';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificareGeo } from 'react-native-notificare-geo';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { NotificareScannables } from 'react-native-notificare-scannables';
import { NotificareMonetize } from 'react-native-notificare-monetize';
import { NotificareInAppMessaging } from 'react-native-notificare-in-app-messaging';
import { useSnackbarContext } from '../contexts/snackbar';

export function EventMonitor() {
  const { addSnackbarInfoMessage } = useSnackbarContext();

  useEffect(
    function setupListeners() {
      const subscriptions = [
        //
        // Notificare events
        //

        Notificare.onReady(async (application) => {
          console.log('=== ON READY ===');
          console.log(JSON.stringify(application, null, 2));

          addSnackbarInfoMessage({
            message: `Notificare is ready: ${application.name}`,
            type: 'standard',
          });
        }),
        Notificare.onUnlaunched(() => {
          console.log('=== ON UNLAUNCHED ===');

          addSnackbarInfoMessage({
            message: `Notificare has finished un-launching.`,
            type: 'standard',
          });
        }),
        Notificare.onDeviceRegistered((device) => {
          console.log('=== DEVICE REGISTERED ===');
          console.log(JSON.stringify(device, null, 2));

          addSnackbarInfoMessage({
            message: `Device registered: ${device.id}`,
            type: 'standard',
          });
        }),
        Notificare.onUrlOpened((url) => {
          console.log('=== URL OPENED ===');
          console.log(JSON.stringify(url, null, 2));

          addSnackbarInfoMessage({
            message: `URL opened: ${url}`,
            type: 'standard',
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
        }),
        NotificarePush.onNotificationActionOpened(
          async ({ notification, action }) => {
            console.log('=== NOTIFICATION ACTION OPENED ===');
            console.log(JSON.stringify({ notification, action }, null, 2));
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
            console.log(
              JSON.stringify({ notification, action, error }, null, 2)
            );
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
        NotificareMonetize.onPurchaseFailed(
          ({ code, message, errorMessage }) => {
            console.log('=== PURCHASE FAILED ===');
            console.log(
              JSON.stringify({ code, message, errorMessage }, null, 2)
            );
          }
        ),

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
    },
    [addSnackbarInfoMessage]
  );

  return null;
}
