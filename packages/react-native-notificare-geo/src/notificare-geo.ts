import {
  AppRegistry,
  EmitterSubscription,
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
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareGeoModule
  ? NativeModules.NotificareGeoModule
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundLocationUpdated(async (location) => {
        await task(location);
      });

      return;
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundRegionEntered(async (region) => {
        await task(region);
      });
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundRegionExited(async (region) => {
        await task(region);
      });
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundBeaconEntered(async (beacon) => {
        await task(beacon);
      });
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundBeaconExited(async (beacon) => {
        await task(beacon);
      });
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

      return;
    }

    if (Platform.OS === 'ios') {
      this.onBackgroundBeaconsRanged(async (data) => {
        await task(data);
      });
    }
  }

  public static onVisitBackgroundTask(
    task: (visit: NotificareVisit) => Promise<void>
  ) {
    if (Platform.OS === 'ios') {
      this.onBackgroundVisit(async (visit) => {
        await task(visit);
      });
    }
  }

  public static onHeadingUpdatedBackgroundTask(
    task: (heading: NotificareHeading) => Promise<void>
  ) {
    if (Platform.OS === 'ios') {
      this.onBackgroundHeadingUpdated(async (heading) => {
        await task(heading);
      });
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

  //
  // Background Events iOS
  //

  private static onBackgroundLocationUpdated(
    callback: (location: NotificareLocation) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_location_updated',
      callback
    );
  }

  private static onBackgroundRegionEntered(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_region_entered',
      callback
    );
  }

  public static onBackgroundRegionExited(
    callback: (region: NotificareRegion) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_region_exited',
      callback
    );
  }

  private static onBackgroundBeaconEntered(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_beacon_entered',
      callback
    );
  }

  private static onBackgroundBeaconExited(
    callback: (beacon: NotificareBeacon) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_beacon_exited',
      callback
    );
  }

  private static onBackgroundBeaconsRanged(
    callback: (data: {
      region: NotificareRegion;
      beacons: NotificareBeacon[];
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_beacons_ranged',
      callback
    );
  }

  private static onBackgroundVisit(
    callback: (visit: NotificareVisit) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_visit',
      callback
    );
  }

  private static onBackgroundHeadingUpdated(
    callback: (heading: NotificareHeading) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.geo.background_heading_updated',
      callback
    );
  }
}
