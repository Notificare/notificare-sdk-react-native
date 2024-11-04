import {
  NotificareBeacon,
  NotificareLocation,
  NotificareRegion,
} from 'react-native-notificare-geo';
import { logCustomBackgroundEvent } from './background-logger';

export const BackgroundCallbackLocationUpdated = async (
  location: NotificareLocation
) => {
  await logCustomBackgroundEvent('LocationUpdated', location);
};

export const BackgroundCallbackRegionEntered = async (
  region: NotificareRegion
) => {
  await logCustomBackgroundEvent('RegionEntered', region);
};

export const BackgroundCallbackRegionExited = async (
  region: NotificareRegion
) => {
  await logCustomBackgroundEvent('RegionExited', region);
};

export const BackgroundCallbackBeaconEntered = async (
  beacon: NotificareBeacon
) => {
  await logCustomBackgroundEvent('BeaconEntered', beacon);
};

export const BackgroundCallbackBeaconExited = async (
  beacon: NotificareBeacon
) => {
  await logCustomBackgroundEvent('BeaconExited', beacon);
};

export const BackgroundCallbackBeaconsRanged = async (data: {
  region: NotificareRegion;
  beacons: NotificareBeacon[];
}) => {
  await logCustomBackgroundEvent('BeaconsRanged', data);
};
