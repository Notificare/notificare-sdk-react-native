import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState } from 'react';
import { Notificare } from 'react-native-notificare';
import { Button, Snackbar } from 'react-native-paper';
import { SnackbarInfo } from '../utils/snackbar';
import { NotificarePush } from 'react-native-notificare-push';
import { useNavigation } from '@react-navigation/native';
import { NotificareAssets } from 'react-native-notificare-assets';
import { NotificareScannables } from 'react-native-notificare-scannables';
import { NotificareLoyalty } from 'react-native-notificare-loyalty';
import { NotificareGeo } from 'react-native-notificare-geo';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import { NotificareAuthentication } from 'react-native-notificare-authentication';
import { NotificareMonetize } from 'react-native-notificare-monetize';
import { NotificareInAppMessaging } from 'react-native-notificare-in-app-messaging';

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

  async function onFetchPassClicked() {
    try {
      const pass = await NotificareLoyalty.fetchPassBySerial(
        '520d974e-b3d5-4d30-93b4-259f9d4bfa1d'
      );
      setSnackbarInfo({ visible: true, label: JSON.stringify(pass) });

      console.log('=== FETCH PASS ===');
      console.log(JSON.stringify(pass, null, 2));

      await NotificareLoyalty.present(pass);
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onEnableLocationUpdatesClicked() {
    try {
      if (!(await ensureForegroundLocationPermission())) return;
      if (!(await ensureBackgroundLocationPermission())) return;
      if (Platform.OS === 'android') {
        if (!(await ensureBluetoothScanPermission())) return;
      }

      await NotificareGeo.enableLocationUpdates();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onDisableLocationUpdatesClicked() {
    try {
      await NotificareGeo.disableLocationUpdates();
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onViewRangingBeaconsClicked() {
    // @ts-ignore
    navigation.navigate('Beacons');
  }

  async function ensureForegroundLocationPermission(): Promise<boolean> {
    const permission: Permission = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    })!;

    let status = await check(permission);
    if (status === 'granted') return true;

    status = await request(permission, {
      title: 'Sample',
      message:
        'We need access to foreground location in order to show relevant content.',
      buttonPositive: 'OK',
    });

    return status === 'granted';
  }

  async function ensureBackgroundLocationPermission(): Promise<boolean> {
    const permission: Permission = Platform.select({
      android:
        Platform.Version >= 29 // Android Q+
          ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    })!;

    let status = await check(permission);
    console.log(status);

    if (status === 'granted') return true;

    status = await request(permission, {
      title: 'Sample',
      message:
        'We need access to background location in order to show relevant content.',
      buttonPositive: 'OK',
    });

    return status === 'granted';
  }

  async function ensureBluetoothScanPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version < 31) return true;

      let status = await check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
      if (status === 'granted') return true;

      status = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN, {
        title: 'Sample',
        message:
          'We need access to bluetooth scan in order to show relevant content.',
        buttonPositive: 'OK',
      });

      return status === 'granted';
    }

    return false;
  }

  //
  // Authentication
  //

  async function onIsLoggedInClicked() {
    try {
      const result = await NotificareAuthentication.isLoggedIn();
      setSnackbarInfo({ visible: true, label: JSON.stringify(result) });

      console.log('=== IS LOGGED IN ===');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onCreateAccountClicked() {
    try {
      await NotificareAuthentication.createAccount(
        'helder+3@notifica.re',
        '123456',
        'Helder Pinhal'
      );
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onLoginClicked() {
    try {
      await NotificareAuthentication.login('helder@notifica.re', '123456');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onLogoutClicked() {
    try {
      await NotificareAuthentication.logout();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchUserDetailsClicked() {
    try {
      const result = await NotificareAuthentication.fetchUserDetails();
      setSnackbarInfo({ visible: true, label: JSON.stringify(result) });

      console.log('=== FETCH USER DETAILS ===');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchUserPreferencesClicked() {
    try {
      const result = await NotificareAuthentication.fetchUserPreferences();
      setSnackbarInfo({ visible: true, label: JSON.stringify(result) });

      console.log('=== FETCH USER PREFERENCES ===');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onFetchUserSegmentsClicked() {
    try {
      const result = await NotificareAuthentication.fetchUserSegments();
      setSnackbarInfo({ visible: true, label: JSON.stringify(result) });

      console.log('=== FETCH USER SEGMENTS ===');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onSendPasswordResetClicked() {
    try {
      await NotificareAuthentication.sendPasswordReset('helder@notifica.re');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onResetPasswordClicked() {
    try {
      await NotificareAuthentication.resetPassword('helder@notifica.re', '---');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onChangePasswordClicked() {
    try {
      await NotificareAuthentication.changePassword('123456');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onValidateUserClicked() {
    try {
      await NotificareAuthentication.validateUser('---');
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onGeneratePushEmailClicked() {
    try {
      const result = await NotificareAuthentication.generatePushEmailAddress();
      setSnackbarInfo({ visible: true, label: JSON.stringify(result) });

      console.log('=== GENERATE PUSH EMAIL ===');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onAddUserSegmentClicked() {
    try {
      const segments = await NotificareAuthentication.fetchUserSegments();

      await NotificareAuthentication.addUserSegment(segments[0]);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onRemoveUserSegmentClicked() {
    try {
      const segments = await NotificareAuthentication.fetchUserSegments();

      await NotificareAuthentication.removeUserSegment(segments[0]);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onAddUserSegmentToPreferenceClicked() {
    try {
      const preferences = await NotificareAuthentication.fetchUserPreferences();

      const preference = preferences[0];
      const option = preference.options[0];

      await NotificareAuthentication.addUserSegmentToPreference(
        preference,
        option
      );
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onRemoveUserSegmentFromPreferenceClicked() {
    try {
      const preferences = await NotificareAuthentication.fetchUserPreferences();

      const preference = preferences[0];
      const option = preference.options[0];

      await NotificareAuthentication.removeUserSegmentFromPreference(
        preference,
        option
      );
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  //
  // Monetize
  //

  async function onRefreshMonetizeClicked() {
    try {
      await NotificareMonetize.refresh();
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onGetProductsClicked() {
    try {
      const products = await NotificareMonetize.getProducts();
      setSnackbarInfo({ visible: true, label: JSON.stringify(products) });

      console.log('=== PRODUCTS ===');
      console.log(JSON.stringify(products, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onGetPurchasesClicked() {
    try {
      const products = await NotificareMonetize.getPurchases();
      setSnackbarInfo({ visible: true, label: JSON.stringify(products) });

      console.log('=== PURCHASES ===');
      console.log(JSON.stringify(products, null, 2));
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onStartPurchaseClicked() {
    try {
      const products = await NotificareMonetize.getProducts();

      if (products.length > 0) {
        await NotificareMonetize.startPurchaseFlow(products[0]);
        setSnackbarInfo({ visible: true, label: 'Done.' });
      }
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  //
  // In-App Messaging
  //

  async function onCheckSuppressedStateClicked() {
    try {
      const suppressed = await NotificareInAppMessaging.hasMessagesSuppressed();
      setSnackbarInfo({ visible: true, label: `Suppressed = ${suppressed}` });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onSuppressMessagesClicked() {
    try {
      await NotificareInAppMessaging.setMessagesSuppressed(true);
      setSnackbarInfo({ visible: true, label: 'Done.' });
    } catch (e) {
      setSnackbarInfo({ visible: true, label: JSON.stringify(e) });
    }
  }

  async function onUnSuppressMessagesClicked() {
    try {
      await NotificareInAppMessaging.setMessagesSuppressed(false);
      setSnackbarInfo({ visible: true, label: 'Done.' });
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

          <Text style={styles.title}>Loyalty</Text>
          <Button onPress={onFetchPassClicked}>Fetch pass</Button>

          <Text style={styles.title}>Geo</Text>
          <Button onPress={onEnableLocationUpdatesClicked}>
            Enable location updates
          </Button>
          <Button onPress={onDisableLocationUpdatesClicked}>
            Disable location updates
          </Button>
          <Button onPress={onViewRangingBeaconsClicked}>
            View ranging beacons
          </Button>

          <Text style={styles.title}>Authentication</Text>
          <Button onPress={onIsLoggedInClicked}>Am I logged in?</Button>
          <Button onPress={onCreateAccountClicked}>Create an account</Button>
          <Button onPress={onLoginClicked}>Login</Button>
          <Button onPress={onLogoutClicked}>Logout</Button>
          <Button onPress={onFetchUserDetailsClicked}>
            Fetch user details
          </Button>
          <Button onPress={onFetchUserPreferencesClicked}>
            Fetch user preferences
          </Button>
          <Button onPress={onFetchUserSegmentsClicked}>
            Fetch user segments
          </Button>
          <Button onPress={onSendPasswordResetClicked}>
            Send password reset
          </Button>
          <Button onPress={onResetPasswordClicked}>Reset password</Button>
          <Button onPress={onChangePasswordClicked}>Change password</Button>
          <Button onPress={onValidateUserClicked}>Validate user</Button>
          <Button onPress={onGeneratePushEmailClicked}>
            Generate push email
          </Button>
          <Button onPress={onAddUserSegmentClicked}>Add user segment</Button>
          <Button onPress={onRemoveUserSegmentClicked}>
            Remove user segment
          </Button>
          <Button onPress={onAddUserSegmentToPreferenceClicked}>
            Add user segment to preference
          </Button>
          <Button onPress={onRemoveUserSegmentFromPreferenceClicked}>
            Remove user segment from preference
          </Button>

          <Text style={styles.title}>Monetize</Text>
          <Button onPress={onRefreshMonetizeClicked}>Refresh</Button>
          <Button onPress={onGetProductsClicked}>Get products</Button>
          <Button onPress={onGetPurchasesClicked}>Get purchases</Button>
          <Button onPress={onStartPurchaseClicked}>Start purchase</Button>

          <Text style={styles.title}>In-App Messaging</Text>
          <Button onPress={onCheckSuppressedStateClicked}>
            Check suppressed state
          </Button>
          <Button onPress={onSuppressMessagesClicked}>Suppress messages</Button>
          <Button onPress={onUnSuppressMessagesClicked}>
            Un-suppress messages
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
