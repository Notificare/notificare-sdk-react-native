import {
  NotificareBeacon,
  NotificareLocation,
  NotificareRegion,
} from 'react-native-notificare-geo';
import { logCustomBackgroundEvent } from './background-logger';

export const BackgroundTaskLocationUpdated = async (
  location: NotificareLocation
) => {
  await logCustomBackgroundEvent('LocationUpdated', location);
};

export const BackgroundTaskRegionEntered = async (region: NotificareRegion) => {
  await logCustomBackgroundEvent('RegionEntered', region);
};

export const BackgroundTaskRegionExited = async (region: NotificareRegion) => {
  await logCustomBackgroundEvent('RegionExited', region);
};

export const BackgroundTaskBeaconEntered = async (beacon: NotificareBeacon) => {
  await logCustomBackgroundEvent('BeaconEntered', beacon);
};

export const BackgroundTaskBeaconExited = async (beacon: NotificareBeacon) => {
  await logCustomBackgroundEvent('BeaconExited', beacon);
};

export const BackgroundTaskBeaconsRanged = async (data: {
  region: NotificareRegion;
  beacons: NotificareBeacon[];
}) => {
  await logCustomBackgroundEvent('BeaconsRanged', data);
};
