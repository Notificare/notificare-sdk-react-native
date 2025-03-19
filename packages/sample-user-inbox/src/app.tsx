import React, { FC, useEffect } from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { HomeView } from './pages/home/home-view';
import { InboxView } from './pages/inbox/inbox-view';
import { Notificare } from 'react-native-notificare';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { EventMonitor } from './components/event-monitor';
import { SnackbarProvider } from './contexts/snackbar';
import { Auth0Provider } from 'react-native-auth0';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

export const App: FC = () => {
  const theme = useColorScheme();
  const domain = process.env.USER_INBOX_CLIENT_DOMAIN;
  const clientId = process.env.USER_INBOX_CLIENT_ID;

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
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, []);

  return (
    <Auth0Provider domain={domain!} clientId={clientId!}>
      <PaperProvider>
        <SnackbarProvider>
          <EventMonitor />
          <NavigationContainer
            theme={theme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack.Navigator initialRouteName="Sample User Inbox">
              <Stack.Screen name="Sample User Inbox" component={HomeView} />
              <Stack.Screen name="Inbox" component={InboxView} />
            </Stack.Navigator>
          </NavigationContainer>
        </SnackbarProvider>
      </PaperProvider>
    </Auth0Provider>
  );
};
