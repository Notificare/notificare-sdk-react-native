import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import { NotificareDeviceModule } from './notificare-device-module';
import { NotificareEventsModule } from './notificare-events-module';
import type { NotificareApplication } from './models/notificare-application';
import type { NotificareNotification } from './models/notificare-notification';
import type { NotificareDynamicLink } from './models/notificare-dynamic-link';
import type { NotificareDevice } from './models/notificare-device';

const LINKING_ERROR =
  `The package 'react-native-notificare' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareModule = isTurboModuleEnabled
  ? require('./NativeNotificareModule').default
  : NativeModules.NotificareModule;

const NativeModule = NotificareModule
  ? NotificareModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class Notificare {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);
  private static readonly deviceModule = new NotificareDeviceModule();
  private static readonly eventsModule = new NotificareEventsModule();

  //
  // Modules
  //

  public static device(): NotificareDeviceModule {
    return this.deviceModule;
  }

  public static events(): NotificareEventsModule {
    return this.eventsModule;
  }

  //
  // Methods
  //

  /**
   * Indicates whether Notificare has been configured.
   *
   * @returns `true` if Notificare is successfully configured, and `false`
   * otherwise.
   */
  public static async isConfigured(): Promise<boolean> {
    return await NativeModule.isConfigured();
  }

  /**
   * Indicates whether Notificare is ready.
   *
   * @returns `true` once the SDK has completed the initialization process and
   * is ready for use.
   */
  public static async isReady(): Promise<boolean> {
    return await NativeModule.isReady();
  }

  /**
   * Launches the Notificare SDK, and all the additional available modules,
   * preparing them for use.
   */
  public static async launch(): Promise<void> {
    await NativeModule.launch();
  }

  /**
   * Unlaunches the Notificare SDK.
   *
   * This method shuts down the SDK, removing all data, both locally and remotely
   * in the servers. It destroys all the device's data permanently.
   */
  public static async unlaunch(): Promise<void> {
    await NativeModule.unlaunch();
  }

  /**
   * Provides the current application metadata, if available.
   *
   * @returns the {@link NotificareApplication} object representing the configured
   * application, or `null` if the application is not yet available.
   */
  public static async getApplication(): Promise<NotificareApplication | null> {
    return await NativeModule.getApplication();
  }

  /**
   * Fetches the application metadata.
   *
   * @return The {@link NotificareApplication} metadata.
   */
  public static async fetchApplication(): Promise<NotificareApplication> {
    return await NativeModule.fetchApplication();
  }

  /**
   * Fetches a {@link NotificareNotification} by its ID.
   *
   * @param id The ID of the notification to fetch.
   * @return The {@link NotificareNotification} object associated with the
   * provided ID.
   */
  public static async fetchNotification(
    id: string
  ): Promise<NotificareNotification> {
    return await NativeModule.fetchNotification(id);
  }

  /**
   * Fetches a {@link NotificareDynamicLink} from a URL.
   *
   * @param url The URL to fetch the dynamic link from.
   * @return The {@link NotificareDynamicLink} object.
   */
  public static async fetchDynamicLink(
    url: string
  ): Promise<NotificareDynamicLink> {
    return await NativeModule.fetchDynamicLink(url);
  }

  /**
   * Checks if a deferred link exists and can be evaluated.
   *
   * @return `true` if a deferred link can be evaluated, `false` otherwise.
   */
  public static async canEvaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.canEvaluateDeferredLink();
  }

  /**
   * Evaluates the deferred link, triggering an intent with the resolved deferred
   * link.
   *
   * @return `true` if the deferred link was successfully evaluated, `false`
   * otherwise.
   */
  public static async evaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.evaluateDeferredLink();
  }

  //
  // Events
  //

  /**
   * Called when the Notificare SDK is fully ready and the application metadata
   * is available.
   *
   * This method is invoked after the SDK has been successfully launched and is
   * available for use.
   *
   * @param callback A callback that will be invoked with the result of the
   * onReady event. It will the {@link NotificareApplication} object containing
   * the application's metadata.
   */
  public static onReady(
    callback: (application: NotificareApplication) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.ready', callback);
  }

  /**
   * Called when the Notificare SDK has been unlaunched.
   *
   * This method is invoked after the SDK has been shut down (unlaunched) and
   * is no longer in use.
   *
   * @param callback A callback that will be invoked with the result of the
   * onUnlaunched event.
   */
  public static onUnlaunched(callback: () => void): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.unlaunched', callback);
  }

  /**
   * Called when the device has been successfully registered with the Notificare
   * platform.
   *
   * This method is triggered once after the device has been registered, and will
   * only be triggered again when a new device is created after an unlaunch() is
   * called.
   *
   * @param callback A callback that will be invoked with the result of the
   * onDeviceRegistered event. It will provide the registered {@link NotificareDevice}
   * instance representing the device's registration details.
   */
  public static onDeviceRegistered(
    callback: (device: NotificareDevice) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.device_registered',
      callback
    );
  }

  /**
   * Called when the device opens a URL.
   *
   * This method is invoked when the device opens a URL.
   *
   * @param callback A callback that will be invoked with the result of the
   * onUrlOpened event. It will provide the opened URL.
   */
  public static onUrlOpened(
    callback: (url: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.url_opened', callback);
  }
}
