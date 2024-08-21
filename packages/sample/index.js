/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/app';
import { name as appName } from './app.json';
import { NotificareGeo } from 'react-native-notificare-geo';
import {
  BackgroundCallbackBeaconEntered,
  BackgroundCallbackBeaconExited,
  BackgroundCallbackBeaconsRanged,
  BackgroundCallbackLocationUpdated,
  BackgroundCallbackRegionEntered,
  BackgroundCallbackRegionExited,
} from './src/background/background-callback';

function setupBackgroundCallbacks() {
  NotificareGeo.setLocationUpdatedBackgroundCallback(
    BackgroundCallbackLocationUpdated
  );

  NotificareGeo.setRegionEnteredBackgroundCallback(
    BackgroundCallbackRegionEntered
  );

  NotificareGeo.setRegionExitedBackgroundCallback(
    BackgroundCallbackRegionExited
  );

  NotificareGeo.setBeaconEnteredBackgroundCallback(
    BackgroundCallbackBeaconEntered
  );

  NotificareGeo.setBeaconExitedBackgroundCallback(
    BackgroundCallbackBeaconExited
  );

  NotificareGeo.setBeaconsRangedBackgroundCallback(
    BackgroundCallbackBeaconsRanged
  );
}

setupBackgroundCallbacks();

AppRegistry.registerComponent(appName, () => App);
