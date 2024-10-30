import { useEffect } from 'react';
import { Notificare } from 'react-native-notificare';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
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

        NotificarePush.onSubscriptionChanged((subscription) => {
          console.log('=== SUBSCRIPTION CHANGED ===');
          console.log(JSON.stringify(subscription, null, 2));
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
      ];

      return () => subscriptions.forEach((s) => s.remove());
    },
    [addSnackbarInfoMessage]
  );

  return null;
}
