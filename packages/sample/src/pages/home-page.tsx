import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState } from 'react';
import { Notificare } from 'react-native-notificare';
import { Button, Snackbar } from 'react-native-paper';
import { SnackbarInfo } from '../utils/snackbar';
import { NotificarePush } from 'react-native-notificare-push';
import { useNavigation } from '@react-navigation/native';
import { NotificareAssets } from 'react-native-notificare-assets';
import { NotificareScannables } from 'react-native-notificare-scannables';

export const HomePage: FC = () => {
  const navigation = useNavigation();
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({
    visible: false,
  });

  async function onLaunchClicked() {
    try {
      await Notificare.launch();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onUnlaunchClicked() {
    try {
      await Notificare.unlaunch();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchApplicationClicked() {
    try {
      const application = await Notificare.fetchApplication();
      setSnackbarInfo({ visible: true, label: JSON.stringify(application) });

      console.log('=== APPLICATION ===');
      console.log(JSON.stringify(application, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onCachedApplicationClicked() {
    try {
      const application = await Notificare.getApplication();
      setSnackbarInfo({ visible: true, label: JSON.stringify(application) });

      console.log('=== APPLICATION ===');
      console.log(JSON.stringify(application, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchNotificationClicked() {
    try {
      const notification = await Notificare.fetchNotification(
        '618e4812974aab0d61ac1483'
      );
      setSnackbarInfo({ visible: true, label: JSON.stringify(notification) });

      console.log('=== NOTIFICATION ===');
      console.log(JSON.stringify(notification, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  //
  // Device
  //

  async function onCurrentDeviceClicked() {
    try {
      const device = await Notificare.device().getCurrentDevice();
      setSnackbarInfo({ visible: true, label: JSON.stringify(device) });

      console.log('=== CURRENT DEVICE ===');
      console.log(JSON.stringify(device, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onRegisterDeviceWithUserClicked() {
    try {
      await Notificare.device().register('helder@notifica.re', 'Helder Pinhal');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onRegisterDeviceWithAnonymousUserClicked() {
    try {
      await Notificare.device().register(null, null);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchTagsClicked() {
    try {
      const tags = await Notificare.device().fetchTags();
      setSnackbarInfo({ visible: true, label: JSON.stringify(tags) });

      console.log('=== TAGS ===');
      console.log(JSON.stringify(tags, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onAddTagsClicked() {
    try {
      await Notificare.device().addTags([
        'react-native',
        'hpinhal',
        'remove-me',
      ]);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onRemoveTagsClicked() {
    try {
      await Notificare.device().removeTags(['remove-me']);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onClearTagsClicked() {
    try {
      await Notificare.device().clearTags();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchDoNotDisturbClicked() {
    try {
      const dnd = await Notificare.device().fetchDoNotDisturb();
      setSnackbarInfo({ visible: true, label: JSON.stringify(dnd) });

      console.log('=== DO NOT DISTURB ===');
      console.log(JSON.stringify(dnd, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onUpdateDoNotDisturbClicked() {
    try {
      await Notificare.device().updateDoNotDisturb({
        start: '23:00',
        end: '08:00',
      });
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onClearDoNotDisturbClicked() {
    try {
      await Notificare.device().clearDoNotDisturb();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchUserDataClicked() {
    try {
      const userData = await Notificare.device().fetchUserData();
      setSnackbarInfo({ visible: true, label: JSON.stringify(userData) });

      console.log('=== USER DATA===');
      console.log(JSON.stringify(userData, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onUpdateUserDataClicked() {
    try {
      await Notificare.device().updateUserData({
        firstName: 'Helder',
        lastName: 'Pinhal',
      });
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchPreferredLanguageClicked() {
    try {
      const language = await Notificare.device().getPreferredLanguage();
      setSnackbarInfo({ visible: true, label: JSON.stringify(language) });

      console.log('=== LANGUAGE ===');
      console.log(JSON.stringify(language, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onUpdatePreferredLanguageClicked() {
    try {
      await Notificare.device().updatePreferredLanguage('nl-NL');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onClearPreferredLanguageClicked() {
    try {
      await Notificare.device().updatePreferredLanguage(null);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  //
  // Events
  //

  async function onLogCustomEventClicked() {
    try {
      await Notificare.events().logCustom('CUSTOM_EVENT');

      await Notificare.events().logCustom('CUSTOM_EVENT', {
        string: 'Hello world',
        number: 10,
      });

      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onHasRemoteNotificationEnabledClicked() {
    try {
      const enabled = await NotificarePush.hasRemoteNotificationsEnabled();
      setSnackbarInfo({ visible: true, label: JSON.stringify(enabled) });

      console.log('=== HAS REMOTE NOTIFICATIONS ENABLED ===');
      console.log(JSON.stringify(enabled, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onAllowedUIClicked() {
    try {
      const allowed = await NotificarePush.allowedUI();
      setSnackbarInfo({ visible: true, label: JSON.stringify(allowed) });

      console.log('=== ALLOWED UI ===');
      console.log(JSON.stringify(allowed, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onEnableRemoteNotificationsClicked() {
    try {
      await NotificarePush.enableRemoteNotifications();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onDisableRemoteNotificationsClicked() {
    try {
      await NotificarePush.disableRemoteNotifications();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onOpenInboxClicked() {
    // @ts-ignore
    navigation.navigate('Inbox');
  }

  async function onFetchAssetsClicked() {
    try {
      const assets = await NotificareAssets.fetch('LANDSCAPES');
      setSnackbarInfo({ visible: true, label: JSON.stringify(assets) });

      console.log('=== FETCH ASSETS ===');
      console.log(JSON.stringify(assets, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onStartScannableSessionClicked() {
    try {
      await NotificareScannables.startScannableSession();

      // if (await NotificareScannables.canStartNfcScannableSession()) {
      //   await NotificareScannables.startNfcScannableSession();
      // } else {
      //   await NotificareScannables.startQrCodeScannableSession();
      // }
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Button onPress={onLaunchClicked}>Launch</Button>
          <Button onPress={onUnlaunchClicked}>Unlaunch</Button>
          <Button onPress={onFetchApplicationClicked}>Fetch application</Button>
          <Button onPress={onCachedApplicationClicked}>
            Cached application
          </Button>
          <Button onPress={onFetchNotificationClicked}>
            Fetch notification
          </Button>

          <Text style={styles.title}>Device</Text>
          <Button onPress={onCurrentDeviceClicked}>Current device</Button>
          <Button onPress={onRegisterDeviceWithUserClicked}>
            Register device with user
          </Button>
          <Button onPress={onRegisterDeviceWithAnonymousUserClicked}>
            Register device with anonymous user
          </Button>
          <Button onPress={onFetchTagsClicked}>Fetch tags</Button>
          <Button onPress={onAddTagsClicked}>Add tags</Button>
          <Button onPress={onRemoveTagsClicked}>Remove tags</Button>
          <Button onPress={onClearTagsClicked}>Clear tags</Button>
          <Button onPress={onFetchDoNotDisturbClicked}>
            Fetch do not disturb
          </Button>
          <Button onPress={onUpdateDoNotDisturbClicked}>
            Update do not disturb
          </Button>
          <Button onPress={onClearDoNotDisturbClicked}>
            Clear do not disturb
          </Button>
          <Button onPress={onFetchUserDataClicked}>Fetch user data</Button>
          <Button onPress={onUpdateUserDataClicked}>Update user data</Button>
          <Button onPress={onFetchPreferredLanguageClicked}>
            Fetch preferred language
          </Button>
          <Button onPress={onUpdatePreferredLanguageClicked}>
            Update preferred language
          </Button>
          <Button onPress={onClearPreferredLanguageClicked}>
            Clear preferred language
          </Button>

          <Text style={styles.title}>Events</Text>
          <Button onPress={onLogCustomEventClicked}>Log custom event</Button>

          <Text style={styles.title}>Push</Text>
          <Button onPress={onHasRemoteNotificationEnabledClicked}>
            Has remote notifications enabled
          </Button>
          <Button onPress={onAllowedUIClicked}>Allowed UI</Button>
          <Button onPress={onEnableRemoteNotificationsClicked}>
            Enable remote notifications
          </Button>
          <Button onPress={onDisableRemoteNotificationsClicked}>
            Disable remote notifications
          </Button>

          <Text style={styles.title}>Inbox</Text>
          <Button onPress={onOpenInboxClicked}>Open the inbox</Button>

          <Text style={styles.title}>Assets</Text>
          <Button onPress={onFetchAssetsClicked}>Fetch assets</Button>

          <Text style={styles.title}>Scannables</Text>
          <Button onPress={onStartScannableSessionClicked}>
            Start scannable session
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarInfo.visible}
        onDismiss={() => setSnackbarInfo({ visible: false })}
      >
        {snackbarInfo.label}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
  },
});
