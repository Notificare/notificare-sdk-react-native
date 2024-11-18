import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SnackbarProvider } from '@/components/contexts/snackbar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SnackbarProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Sample Expo' }} />
          <Stack.Screen name="device" options={{ title: 'Device' }} />
          <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
          <Stack.Screen name="tags" options={{ title: 'Tags' }} />
          <Stack.Screen name="beacons" options={{ title: 'Beacons' }} />
          <Stack.Screen name="scannables" options={{ title: 'Scannables' }} />
          <Stack.Screen name="assets" options={{ title: 'Assets' }} />
          <Stack.Screen
            name="custom-events"
            options={{ title: 'Custom Events' }}
          />
        </Stack>
      </SnackbarProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
