import React, { FC, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { HomeView } from './pages/home/home-view';
import { InboxView } from './pages/inbox/inbox-view';
import { Notificare } from 'react-native-notificare';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { BeaconsView } from './pages/beacons/beacons-view';
import { DeviceView } from './pages/device/device-view';
import { TagsView } from './pages/tags/tags-view';
import { AssetsView } from './pages/assets/assets-view';
import { CustomEventView } from './pages/events/custom-events-view';
import { MonetizeView } from './pages/monetize/monetize-view';
import { ScannablesView } from './pages/scannables/scannables-view';
import { EventMonitor } from './components/event-monitor';
import { SnackbarProvider } from './contexts/snackbar';
import { NotificareScannables } from 'react-native-notificare-scannables';

const Stack = createNativeStackNavigator();

export const App: FC = () => {
  useEffect(function launch() {
    (async () => {
      await NotificarePush.setPresentationOptions(['banner', 'badge', 'sound']);
      await Notificare.launch();
    })();
  }, []);

  useEffect(function setupListeners() {
    const subscriptions = [
      NotificarePush.onNotificationOpened(async (notification) => {
        await NotificarePushUI.presentNotification(notification);
      }),

      NotificarePush.onNotificationActionOpened(
        async ({ notification, action }) => {
          await NotificarePushUI.presentAction(notification, action);
        }
      ),
      NotificareScannables.onScannableDetected(async (scannable) => {
        if (scannable.notification != null) {
          await NotificarePushUI.presentNotification(scannable.notification);
        }
      }),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  return (
    <PaperProvider>
      <SnackbarProvider>
        <EventMonitor />
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
      </SnackbarProvider>
    </PaperProvider>
  );
};
