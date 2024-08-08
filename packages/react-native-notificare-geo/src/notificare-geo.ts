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

  public static async hasLocationServicesEnabled(): Promise<boolean> {
    return await NativeModule.hasLocationServicesEnabled();
  }

  public static async hasBluetoothEnabled(): Promise<boolean> {
    return await NativeModule.hasBluetoothEnabled();
  }

  public static async getMonitoredRegions(): Promise<NotificareRegion[]> {
    return await NativeModule.getMonitoredRegions();
  }

  public static async getEnteredRegions(): Promise<NotificareRegion[]> {
    return await NativeModule.getEnteredRegions();
  }

  public static async enableLocationUpdates(): Promise<void> {
    await NativeModule.enableLocationUpdates();
  }

  public static async disableLocationUpdates(): Promise<void> {
    await NativeModule.disableLocationUpdates();
  }

  //
  // Background methods
  //

  public static onLocationUpdatedBackgroundTask(
    task: (location: NotificareLocation) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_location_updated',
        () => task
      );
    }
  }

  public static onRegionEnteredBackgroundTask(
    task: (region: NotificareRegion) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_region_entered',
        () => task
      );
    }
  }

  public static onRegionExitedBackgroundTask(
    task: (region: NotificareRegion) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_region_exited',
        () => task
      );
    }
  }

  public static onBeaconEnteredBackgroundTask(
    task: (beacon: NotificareBeacon) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_beacon_entered',
        () => task
      );
    }
  }

  public static onBeaconExitedBackgroundTask(
    task: (beacon: NotificareBeacon) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_beacon_exited',
        () => task
      );
    }
  }

  public static onBeaconsRangedBackgroundTask(
    task: (data: {
      region: NotificareRegion;
      beacons: NotificareBeacon[];
    }) => Promise<void>
  ) {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask(
        're.notifica.geo.background_task_beacons_ranged',
        () => task
      );
    }
  }

  //
  // Events
  //

  public static onLocationUpdated(
    callback: (location: NotificareLocation) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.location_updated',
      callback
    );
  }

  public static onRegionEntered(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.region_entered',
      callback
    );
  }

  public static onRegionExited(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.region_exited',
      callback
    );
  }

  public static onBeaconEntered(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.beacon_entered',
      callback
    );
  }

  public static onBeaconExited(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.beacon_exited',
      callback
    );
  }

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

  public static onVisit(
    callback: (visit: NotificareVisit) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.geo.visit', callback);
  }

  public static onHeadingUpdated(
    callback: (heading: NotificareHeading) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.heading_updated',
      callback
    );
  }
}
