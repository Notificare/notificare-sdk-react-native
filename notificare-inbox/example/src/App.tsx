import * as React from 'react';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { Notificare } from 'react-native-notificare';
import { NotificareInbox } from 'react-native-notificare-inbox';
import { NotificarePush } from 'react-native-notificare-push';
import { TextButton } from './components/text-button';

export default function App() {
  const openFirstItem = async () => {
    const items = await NotificareInbox.getItems();
    if (items.length > 0) {
      const notification = await NotificareInbox.open(items[0]);
      console.log('=== NOTIFICATION ===');
      console.log(JSON.stringify(notification, null, 2));
    } else {
      console.log('No items in the inbox.');
    }
  };

  const listItems = async () => {
    const items = await NotificareInbox.getItems();
    items.forEach((item) => console.log(JSON.stringify(item)));
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
      NotificareInbox.onInboxUpdated((items) => {
        console.log('=== INBOX UPDATED ===');
        console.log(`Inbox size = ${items.length}`);
        console.log(`Last item = ${JSON.stringify(items.length > 0 ? items[items.length - 1] : null, null, 2)}`);
      }),
      NotificareInbox.onBadgeUpdated((badge) => {
        console.log('=== BADGE UPDATED ===');
        console.log(`Badge = ${badge}`);
      }),
    ];

    // Remove event subscriptions on un-mount.
    return () => subscriptions.forEach((sub) => sub.remove());
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <TextButton text="Open first item" onPress={openFirstItem} />
          <TextButton text="List items" onPress={listItems} />
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
