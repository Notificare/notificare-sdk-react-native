import * as React from 'react';
import { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NotificarePush } from 'react-native-notificare-push';
import { Notificare } from 'react-native-notificare';
import { TextButton } from './components/text-button';

export default function App() {
  const isRemoteNotificationsEnabled = async () => {
    try {
      const enabled = await NotificarePush.isRemoteNotificationsEnabled();

      Alert.alert('', `Enabled = ${enabled}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
      console.log(e);
    }
  };

  const enableRemoteNotifications = async () => {
    try {
      await NotificarePush.enableRemoteNotifications();

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
      console.log(e);
    }
  };

  const disableRemoteNotifications = async () => {
    try {
      await NotificarePush.disableRemoteNotifications();

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      await Notificare.setUseAdvancedLogging(true);
      await Notificare.launch();
    })();

    const subscriptions = [
      Notificare.onReady((application) => {
        console.log(`Application = ${application.name}`);
        console.log(JSON.stringify(application, null, 2));

        (async () => {
          if (await NotificarePush.isRemoteNotificationsEnabled()) {
            await NotificarePush.enableRemoteNotifications();
          }
        })();
      }),
      NotificarePush.onNotificationReceived((notification) => {
        console.log('=== NOTIFICATION RECEIVED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onNotificationOpened((notification) => {
        console.log('=== NOTIFICATION OPENED ===');
        console.log(JSON.stringify(notification, null, 2));
      }),
      NotificarePush.onNotificationSettingsChanged((granted) => {
        console.log('=== NOTIFICATION SETTINGS CHANGED ===');
        console.log(`Granted = ${granted}`);
      }),
      NotificarePush.onFailedToRegisterForRemoteNotifications((error) => {
        console.log('=== FAILED TO REGISTER FOR REMOTE NOTIFICATIONS ===');
        console.log(error);
      }),
    ];

    // Remove event subscriptions on un-mount.
    return () => subscriptions.forEach((sub) => sub.remove());
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <TextButton text="Is remote notifications enabled" onPress={isRemoteNotificationsEnabled} />
          <TextButton text="Enable remote notifications" onPress={enableRemoteNotifications} />
          <TextButton text="Disable remote notifications" onPress={disableRemoteNotifications} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
