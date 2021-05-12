import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Notificare } from 'react-native-notificare';
import { NotificarePush } from 'react-native-notificare-push';
import { NotificarePushUI } from 'react-native-notificare-push-ui';
import { TextButton } from './components/text-button';

export default function App() {
  const enableRemoteNotifications = async () => {
    try {
      await NotificarePush.enableRemoteNotifications();

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      await Notificare.setUseAdvancedLogging(true);
      await NotificarePush.setPresentationOptions(['alert', 'badge', 'sound']);
      await Notificare.launch();
    })();

    const subscriptions = [
      Notificare.onReady((application) => {
        console.log('=== NOTIFICARE READY ===');
        console.log(`Application = ${application.name}`);

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
      NotificarePush.onNotificationOpened(async (notification) => {
        console.log('=== NOTIFICATION OPENED ===');
        console.log(JSON.stringify(notification, null, 2));

        if (notification.actions.length > 0) {
          await NotificarePushUI.presentAction(notification, notification.actions[0]);
          return;
        }

        await NotificarePushUI.presentNotification(notification);
      }),
    ];

    // Remove event subscriptions on un-mount.
    return () => subscriptions.forEach((sub) => sub.remove());
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <TextButton text="Enable remote notifications" onPress={enableRemoteNotifications} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16,
  },
});
