import * as React from 'react';
import { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Notificare from 'react-native-notificare';
import { TextButton } from './components/text-button';

export default function App() {
  const getApplication = async () => {
    try {
      const application = await Notificare.getApplication();

      Alert.alert('', `Application = ${application?.name}`);
      console.log(JSON.stringify(application, null, 2));
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const fetchApplication = async () => {
    try {
      const application = await Notificare.fetchApplication();

      Alert.alert('', `Application = ${application?.name}`);
      console.log(JSON.stringify(application, null, 2));
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const registerWithUser = async () => {
    try {
      await Notificare.deviceManager.register('helder@notifica.re', 'Helder Pinhal');

      Alert.alert('', 'Done.');
    } catch (e) {
      console.error(e);
      Alert.alert(JSON.stringify(e));
    }
  };

  const registerAnonymous = async () => {
    try {
      await Notificare.deviceManager.register(null, null);

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const getCurrentDevice = async () => {
    try {
      const device = await Notificare.deviceManager.getCurrentDevice();

      Alert.alert('', `Device = ${device?.id}`);
      console.log(JSON.stringify(device, null, 2));
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const fetchTags = async () => {
    try {
      const value = await Notificare.deviceManager.fetchTags();

      Alert.alert('', `${JSON.stringify(value)}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const addTags = async () => {
    try {
      await Notificare.deviceManager.addTags(['react-native', 'hpinhal']);

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const removeTag = async () => {
    try {
      await Notificare.deviceManager.removeTag('hpinhal');

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const clearTags = async () => {
    try {
      await Notificare.deviceManager.clearTags();

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const fetchDoNotDisturb = async () => {
    try {
      const value = await Notificare.deviceManager.fetchDoNotDisturb();

      Alert.alert('', `${JSON.stringify(value)}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const updateDoNotDisturb = async () => {
    try {
      await Notificare.deviceManager.updateDoNotDisturb({
        start: '23:00',
        end: '08:00',
      });

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const clearDoNotDisturb = async () => {
    try {
      await Notificare.deviceManager.clearDoNotDisturb();

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const getPreferredLanguage = async () => {
    try {
      const value = await Notificare.deviceManager.getPreferredLanguage();

      Alert.alert('', `Language = ${value}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const updatePreferredLanguage = async () => {
    try {
      await Notificare.deviceManager.updatePreferredLanguage('nl-NL');

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const clearPreferredLanguage = async () => {
    try {
      await Notificare.deviceManager.updatePreferredLanguage(null);

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const fetchUserData = async () => {
    try {
      const value = await Notificare.deviceManager.fetchUserData();

      Alert.alert('', `${JSON.stringify(value)}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const updateUserData = async () => {
    try {
      await Notificare.deviceManager.updateUserData({
        firstName: 'Helder',
        lastName: 'Pinhal',
      });

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const clearUserData = async () => {
    try {
      await Notificare.deviceManager.updateUserData({});

      Alert.alert('', 'Done.');
    } catch (e) {
      Alert.alert(JSON.stringify(e));
    }
  };

  const fetchNotification = async () => {
    try {
      const value = await Notificare.fetchNotification('5fec8c0a5831f9214ebb5833');

      Alert.alert('', `${value.message}`);
      console.log(`${JSON.stringify(value, null, 2)}`);
    } catch (e) {
      Alert.alert(JSON.stringify(e));
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
      }),
      Notificare.onDeviceRegistered((device) => {
        console.log(`Device = ${device.id}`);
        console.log(JSON.stringify(device, null, 2));
      }),
    ];

    // Remove event subscriptions on un-mount.
    return () => subscriptions.forEach((sub) => sub.remove());
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <TextButton text="Get cached application" onPress={getApplication} />
          <TextButton text="Fetch application" onPress={fetchApplication} />
          <TextButton text="Register with user" onPress={registerWithUser} />
          <TextButton text="Register anonymous" onPress={registerAnonymous} />
          <TextButton text="Get current device" onPress={getCurrentDevice} />
          <TextButton text="Fetch tags" onPress={fetchTags} />
          <TextButton text="Add tags" onPress={addTags} />
          <TextButton text="Remove tag" onPress={removeTag} />
          <TextButton text="Clear tags" onPress={clearTags} />
          <TextButton text="Fetch DnD" onPress={fetchDoNotDisturb} />
          <TextButton text="Update DnD" onPress={updateDoNotDisturb} />
          <TextButton text="Clear DnD" onPress={clearDoNotDisturb} />
          <TextButton text="Get preferred language" onPress={getPreferredLanguage} />
          <TextButton text="Update preferred language" onPress={updatePreferredLanguage} />
          <TextButton text="Clear preferred language" onPress={clearPreferredLanguage} />
          <TextButton text="Fetch user data" onPress={fetchUserData} />
          <TextButton text="Update user data" onPress={updateUserData} />
          <TextButton text="Clear user data" onPress={clearUserData} />
          <TextButton text="Fetch notification" onPress={fetchNotification} />
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
