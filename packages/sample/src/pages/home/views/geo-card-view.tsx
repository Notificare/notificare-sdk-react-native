import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../../components/card-view';
import { mainStyles } from '../../../styles/styles';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import { NotificareGeo } from 'react-native-notificare-geo';
import { useNavigation } from '@react-navigation/native';
import { useSnackbarContext } from '../../../contexts/snackbar';

export const GeoCardView = () => {
  const { addSnackbarInfoMessage } = useSnackbarContext();
  const [hasLocationEnabled, setHasLocationEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(
    function checkLocationStatus() {
      (async () => {
        try {
          const permission: Permission = Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })!;

          let status = await check(permission);

          const enabled =
            (await NotificareGeo.hasLocationServicesEnabled()) &&
            status === 'granted';

          setHasLocationEnabled(enabled);
        } catch (e) {
          console.log('=== Error checking location status ===');
          console.log(JSON.stringify(e));

          addSnackbarInfoMessage({
            message: 'Error checking location status.',
            type: 'error',
          });
        }
      })();
    },
    [addSnackbarInfoMessage]
  );

  async function updateLocationStatus(enabled: boolean) {
    setHasLocationEnabled(enabled);

    if (!enabled) {
      try {
        await NotificareGeo.disableLocationUpdates();
        console.log('=== Disabled location updates successfully ===');

        addSnackbarInfoMessage({
          message: 'Disabled location update successfully.',
          type: 'success',
        });
      } catch (e) {
        console.log('=== Error disabling location updates ===');
        console.log(JSON.stringify(e));

        addSnackbarInfoMessage({
          message: 'Error disabling location updates.',
          type: 'error',
        });
      }

      return;
    }

    try {
      if (await ensureForegroundLocationPermission()) {
        await NotificareGeo.enableLocationUpdates();
        console.log('=== Enabled location updates successfully ===');

        addSnackbarInfoMessage({
          message: 'Enabled location updates successfully successfully.',
          type: 'success',
        });
      } else {
        setHasLocationEnabled(false);

        return;
      }
    } catch (e) {
      console.log('=== Error enabling foreground location updates ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error enabling foreground location updates.',
        type: 'error',
      });
    }

    try {
      if (await ensureBackgroundLocationPermission()) {
        await ensureBluetoothScanPermission();
        await NotificareGeo.enableLocationUpdates();
        console.log('=== Enabled background location updates successfully ===');

        addSnackbarInfoMessage({
          message: 'Enabled background location updates successfully.',
          type: 'success',
        });
      }
    } catch (e) {
      console.log('=== Error enabling background location updates  ===');
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message: 'Error enabling background location updates.',
        type: 'error',
      });
    }
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
        Number(Platform.Version) >= 29 // Android Q+
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

  function onBeaconsClicked() {
    // @ts-ignore
    navigation.navigate('Beacons');
  }

  async function showLocationStatusInfo() {
    try {
      const hasLocationServicesEnabled =
        await NotificareGeo.hasLocationServicesEnabled();
      const hasBluetoothEnabled = await NotificareGeo.hasBluetoothEnabled();

      Alert.alert(
        'Location Status',
        `hasLocationServicesEnabled: ${hasLocationServicesEnabled}
hasBluetoothEnabled: ${hasBluetoothEnabled}`,
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      );
    } catch (e) {
      console.log(
        '=== Error getting hasLocationServicesEnabled / hasBluetoothEnabled ==='
      );
      console.log(JSON.stringify(e));

      addSnackbarInfoMessage({
        message:
          'Error getting hasLocationServicesEnabled / hasBluetoothEnabled.',
        type: 'error',
      });
    }
  }

  return (
    <View>
      <View style={mainStyles.section_title_row}>
        <Text style={mainStyles.section_title}>Geo</Text>

        <TouchableOpacity onPress={showLocationStatusInfo}>
          <Icon name="info" size={18} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={mainStyles.row}>
          <Icon name="notifications" size={18} />

          <Text style={mainStyles.subtitle}>Location</Text>

          <Switch
            style={mainStyles.switch}
            value={hasLocationEnabled}
            onValueChange={updateLocationStatus}
          />
        </View>

        <View style={mainStyles.divider_margin} />

        <TouchableOpacity onPress={onBeaconsClicked}>
          <View style={mainStyles.row}>
            <Icon name="bluetooth-searching" size={18} />

            <Text style={mainStyles.subtitle}>Beacons</Text>

            <Icon name="arrow-forward-ios" size={14} color="#00000026" />
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
