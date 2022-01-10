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

const Stack = createNativeStackNavigator();

export const App: FC = () => {
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({
    visible: false,
  });

  useEffect(() => {
    const subscriptions = [
      Notificare.onReady((application) => {
        console.log('=== ON READY ===');
        console.log(JSON.stringify(application, null, 2));

        setSnackbarInfo({
          visible: true,
          label: `Notificare is ready: ${application.name}`,
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
    ];

    return () => subscriptions.forEach((s) => s.remove());
  });

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
