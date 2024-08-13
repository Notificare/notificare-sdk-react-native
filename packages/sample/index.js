/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/app';
import { name as appName } from './app.json';
import { NotificareGeo } from 'react-native-notificare-geo';
import {
  BackgroundTaskBeaconEntered,
  BackgroundTaskBeaconExited,
  BackgroundTaskBeaconsRanged,
  BackgroundTaskLocationUpdated,
  BackgroundTaskRegionEntered,
  BackgroundTaskRegionExited,
} from './src/background/background-task';

function setupBackgroundTasks() {
  NotificareGeo.onLocationUpdatedBackgroundTask(BackgroundTaskLocationUpdated);
  NotificareGeo.onRegionEnteredBackgroundTask(BackgroundTaskRegionEntered);
  NotificareGeo.onRegionExitedBackgroundTask(BackgroundTaskRegionExited);
  NotificareGeo.onBeaconEnteredBackgroundTask(BackgroundTaskBeaconEntered);
  NotificareGeo.onBeaconExitedBackgroundTask(BackgroundTaskBeaconExited);
  NotificareGeo.onBeaconsRangedBackgroundTask(BackgroundTaskBeaconsRanged);
}

setupBackgroundTasks();

AppRegistry.registerComponent(appName, () => App);
