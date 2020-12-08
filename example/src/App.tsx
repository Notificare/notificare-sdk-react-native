import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Notificare } from '@notificare/react-native';
import type {
  NotificareDoNotDisturb,
  NotificareUserData,
} from '../../src/models';

export default function App() {
  React.useEffect(() => {
    Notificare.launch().then();

    (async () => {
      console.log(`Configured: ${await Notificare.isConfigured()}`);
      console.log(`Ready: ${await Notificare.isReady()}`);
    })();

    const subscriptions = [
      Notificare.onReady(() => console.log('Notificare is ready.')),
      Notificare.onDeviceRegistered((device) =>
        console.log(`Device registered: ${JSON.stringify(device, null, 2)}`)
      ),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Get current device"
        onPress={async () => {
          const device = await Notificare.deviceManager.getCurrentDevice();
          console.log(JSON.stringify(device, null, 2));
        }}
      />

      <Button
        title="Register with user"
        onPress={async () => {
          await Notificare.deviceManager.register(
            'helder@notifica.re',
            'Helder Pinhal'
          );

          console.log('Done.');
        }}
      />

      <Button
        title="Register anonymous"
        onPress={async () => {
          await Notificare.deviceManager.register(null, null);
          console.log('Done.');
        }}
      />

      <Button
        title="Fetch tags"
        onPress={async () => {
          const tags = await Notificare.deviceManager.fetchTags();
          console.log(JSON.stringify(tags, null, 2));
        }}
      />

      <Button
        title="Add tags"
        onPress={async () => {
          await Notificare.deviceManager.addTags([
            'hpinhal',
            'react-native',
            'remove-me',
          ]);

          console.log('Done.');
        }}
      />

      <Button
        title="Remove tags"
        onPress={async () => {
          await Notificare.deviceManager.removeTag('remove-me');
          console.log('Done.');
        }}
      />

      <Button
        title="Clear tag"
        onPress={async () => {
          await Notificare.deviceManager.clearTags();
          console.log('Done.');
        }}
      />

      <Button
        title="Get preferred language"
        onPress={async () => {
          const language = await Notificare.deviceManager.getPreferredLanguage();
          console.log(`Language = ${language}`);
        }}
      />

      <Button
        title="Update preferred language"
        onPress={async () => {
          await Notificare.deviceManager.updatePreferredLanguage('nl-NL');
          console.log('Done.');
        }}
      />

      <Button
        title="Clear preferred language"
        onPress={async () => {
          await Notificare.deviceManager.updatePreferredLanguage(null);
          console.log('Done.');
        }}
      />

      <Button
        title="Fetch do not disturb"
        onPress={async () => {
          const dnd = await Notificare.deviceManager.fetchDoNotDisturb();
          console.log(JSON.stringify(dnd, null, 2));
        }}
      />

      <Button
        title="Update do not disturb"
        onPress={async () => {
          const dnd: NotificareDoNotDisturb = {
            start: '23:00',
            end: '08:00',
          };

          await Notificare.deviceManager.updateDoNotDisturb(dnd);
          console.log('Done.');
        }}
      />

      <Button
        title="Clear do not disturb"
        onPress={async () => {
          await Notificare.deviceManager.clearDoNotDisturb();
          console.log('Done.');
        }}
      />

      <Button
        title="Fetch user data"
        onPress={async () => {
          const userData = await Notificare.deviceManager.fetchUserData();
          console.log(JSON.stringify(userData, null, 2));
        }}
      />

      <Button
        title="Update user data"
        onPress={async () => {
          const userData: NotificareUserData = {
            firstName: 'Helder',
          };

          await Notificare.deviceManager.updateUserData(userData);
          console.log('Done.');
        }}
      />

      {/*<Button*/}
      {/*  title="Update time"*/}
      {/*  onPress={async () => {*/}
      {/*    Notificare.getCurrentTime()*/}
      {/*      .then((value) => setCurrentTime(value))*/}
      {/*      .catch((e) => console.log(`Error: ${e}`));*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
