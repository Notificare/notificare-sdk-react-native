import {
  EmitterSubscription,
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

  public static async isConfigured(): Promise<boolean> {
    return await NativeModule.isConfigured();
  }

  public static async isReady(): Promise<boolean> {
    return await NativeModule.isReady();
  }

  public static async launch(): Promise<void> {
    await NativeModule.launch();
  }

  public static async unlaunch(): Promise<void> {
    await NativeModule.unlaunch();
  }

  public static async getApplication(): Promise<NotificareApplication | null> {
    return await NativeModule.getApplication();
  }

  public static async fetchApplication(): Promise<NotificareApplication> {
    return await NativeModule.fetchApplication();
  }

  public static async fetchNotification(
    id: string
  ): Promise<NotificareNotification> {
    return await NativeModule.fetchNotification(id);
  }

  public static async fetchDynamicLink(
    url: string
  ): Promise<NotificareDynamicLink> {
    return await NativeModule.fetchDynamicLink(url);
  }

  public static async canEvaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.canEvaluateDeferredLink();
  }

  public static async evaluateDeferredLink(): Promise<boolean> {
    return await NativeModule.evaluateDeferredLink();
  }

  //
  // Events
  //

  public static onReady(
    callback: (application: NotificareApplication) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.ready', callback);
  }

  public static onUnlaunched(callback: () => void): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.unlaunched', callback);
  }

  public static onDeviceRegistered(
    callback: (device: NotificareDevice) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.device_registered',
      callback
    );
  }

  public static onUrlOpened(
    callback: (url: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('re.notifica.url_opened', callback);
  }
}
