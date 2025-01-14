import {
  AppRegistry,
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareLocation } from './models/notificare-location';
import type { NotificareRegion } from './models/notificare-region';
import type { NotificareBeacon } from './models/notificare-beacon';
import type { NotificareVisit } from './models/notificare-visit';
import type { NotificareHeading } from './models/notificare-heading';

const LINKING_ERROR =
  `The package 'react-native-notificare-geo' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareGeoModule = isTurboModuleEnabled
  ? require('./NativeNotificareGeoModule').default
  : NativeModules.NotificareGeoModule;

const NativeModule = NotificareGeoModule
  ? NotificareGeoModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareGeo {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  /**
   * Indicates whether location services are enabled.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the
   * location services are enabled by the application, and `false` otherwise.
   */
  public static async hasLocationServicesEnabled(): Promise<boolean> {
    return await NativeModule.hasLocationServicesEnabled();
  }

  /**
   * Indicates whether Bluetooth is enabled.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if Bluetooth
   * is enabled and available for beacon detection and ranging, and `false` otherwise.
   */
  public static async hasBluetoothEnabled(): Promise<boolean> {
    return await NativeModule.hasBluetoothEnabled();
  }

  /**
   * Provides a list of regions currently being monitored.
   *
   * @returns {Promise<NotificareRegion[]>} - A promise that resolves to a list
   * of {@link NotificareRegion} objects representing the geographical regions
   * being actively monitored for entry and exit events.
   */
  public static async getMonitoredRegions(): Promise<NotificareRegion[]> {
    return await NativeModule.getMonitoredRegions();
  }

  /**
   * Provides a list of regions the user has entered.
   *
   * @returns {Promise<NotificareRegion[]>} - A promise that resolves to a list
   * of {@link NotificareRegion} objects representing the regions that the user
   * has entered and not yet exited.
   */
  public static async getEnteredRegions(): Promise<NotificareRegion[]> {
    return await NativeModule.getEnteredRegions();
  }

  /**
   * Enables location updates, activating location tracking, region monitoring,
   * and beacon detection.
   *
   * **Note**: This function requires explicit location permissions from the user.
   * Starting with Android 10 (API level 29), background location access requires
   * the ACCESS_BACKGROUND_LOCATION permission. For beacon detection, Bluetooth
   * permissions are also necessary. Ensure all permissions are requested before
   * invoking this method.
   *
   * The behavior varies based on granted permissions:
   * - **Permission denied**: Clears the device's location information.
   * - **When In Use permission granted**: Tracks location only while the
   * app is in use.
   * - **Always permission granted**: Enables geofencing capabilities.
   * - **Always + Bluetooth permissions granted**: Enables geofencing
   * and beacon detection.
   *
   * @returns {Promise<void>} - A promise that resolves when location updates
   * have been successfully enabled.
   */
  public static async enableLocationUpdates(): Promise<void> {
    await NativeModule.enableLocationUpdates();
  }

  /**
   * Disables location updates.
   *
   * This method stops receiving location updates, monitoring regions, and
   * detecting nearby beacons.
   *
   * @returns {Promise<void>} - A promise that resolves when location updates
   * have been successfully disabled.
   */
  public static async disableLocationUpdates(): Promise<void> {
    await NativeModule.disableLocationUpdates();
  }

  //
  // Background methods
  //

  /**
   * Sets a callback that will be invoked when an onLocationUpdated event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onLocationUpdated event, when in background. It will provide the updated
   * {@link NotificareLocation} object representing the user's new location.
   */
  public static setLocationUpdatedBackgroundCallback(
    callback: (location: NotificareLocation) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.location_updated_background_callback',
        () => callback
      );
    }
  }

  /**
   * Sets a callback that will be invoked when an onRegionEntered event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionEntered event. It will provide the {@link NotificareRegion}
   * representing the region the user has entered.
   */
  public static setRegionEnteredBackgroundCallback(
    callback: (region: NotificareRegion) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.region_entered_background_callback',
        () => callback
      );
    }
  }

  /**
   * Sets a callback that will be invoked when an onRegionExited event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionExited event. It will provide the {@link NotificareRegion}
   * representing the region the user has exited.
   */
  public static setRegionExitedBackgroundCallback(
    callback: (region: NotificareRegion) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.region_exited_background_callback',
        () => callback
      );
    }
  }

  /**
   * Sets a callback that will be invoked when an onBeaconsEntered event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconEntered event. It will provide the {@link NotificareBeacon}
   * representing the beacon the user has entered the proximity of.
   */
  public static setBeaconEnteredBackgroundCallback(
    callback: (beacon: NotificareBeacon) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.beacon_entered_background_callback',
        () => callback
      );
    }
  }

  /**
   * Sets a callback that will be invoked when an onBeaconsExited event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconExited event. It will provide the {@link NotificareBeacon}
   * representing the beacon the user has exited the proximity of.
   */
  public static setBeaconExitedBackgroundCallback(
    callback: (beacon: NotificareBeacon) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.beacon_exited_background_callback',
        () => callback
      );
    }
  }

  /**
   * Sets a callback that will be invoked when an onBeaconsRanged event is
   * triggered in the background.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconsRanged event. It will provide a list of {@link NotificareBeacon}
   * that were detected and the {@link NotificareRegion} where they were detected.
   */
  public static setBeaconsRangedBackgroundCallback(
    callback: (data: {
      region: NotificareRegion;
      beacons: NotificareBeacon[];
    }) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.beacons_ranged_background_callback',
        () => callback
      );
    }
  }

  //
  // Events
  //

  /**
   * Called when a new location update is received.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onLocationUpdated event. It will provide the updated {@link NotificareLocation}
   * object representing the user's new location.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onLocationUpdated event.
   */
  public static onLocationUpdated(
    callback: (location: NotificareLocation) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.location_updated',
      callback
    );
  }

  /**
   * Called when the user enters a monitored region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionEntered event. It will provide the {@link NotificareRegion}
   * representing the region the user has entered.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onRegionEntered event.
   */
  public static onRegionEntered(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.region_entered',
      callback
    );
  }

  /**
   * Called when the user exits a monitored region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionExited event. It will provide the {@link NotificareRegion}
   * representing the region the user has exited.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onRegionExited event.
   */
  public static onRegionExited(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.region_exited',
      callback
    );
  }

  /**
   * Called when the user enters the proximity of a beacon.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconEntered event. It will provide the {@link NotificareBeacon}
   * representing the beacon the user has entered the proximity of.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onBeaconEntered event.
   */
  public static onBeaconEntered(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.beacon_entered',
      callback
    );
  }

  /**
   * Called when the user exits the proximity of a beacon.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconExited event. It will provide the {@link NotificareBeacon}
   * representing the beacon the user has exited the proximity of.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onBeaconExited event.
   */
  public static onBeaconExited(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.beacon_exited',
      callback
    );
  }

  /**
   * Called when beacons are ranged in a monitored region.
   *
   * This method provides the list of beacons currently detected within the given
   * region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconsRanged event. It will provide a list of {@link NotificareBeacon}
   * that were detected and the {@link NotificareRegion} where they were detected.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onBeaconsRanged event.
   */
  public static onBeaconsRanged(
    callback: (data: {
      region: NotificareRegion;
      beacons: NotificareBeacon[];
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.beacons_ranged',
      callback
    );
  }

  /**
   * Called when the device registers a location visit.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onVisit event. It will provide a {@link NotificareVisit} object representing
   * the details of the visit.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onVisit event.
   */
  public static onVisit(
    callback: (visit: NotificareVisit) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.geo.visit', callback);
  }

  /**
   * Called when there is an update to the device’s heading.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onHeadingUpdated event. It will provide a {@link NotificareHeading} object
   * containing the details of the updated heading.
   * @returns {EmitterSubscription} - The {@link EmitterSubscription} for the
   * onHeadingUpdated event.
   */
  public static onHeadingUpdated(
    callback: (heading: NotificareHeading) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.heading_updated',
      callback
    );
  }
}
