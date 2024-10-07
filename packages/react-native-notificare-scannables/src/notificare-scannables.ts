import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareScannable } from './models/notificare-scannable';

const LINKING_ERROR =
  `The package 'react-native-notificare-scannables' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareScannablesModule = isTurboModuleEnabled
  ? require('./NativeNotificareScannablesModule').default
  : NativeModules.NotificareScannablesModule;

const NativeModule = NotificareScannablesModule
  ? NotificareScannablesModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareScannables {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async canStartNfcScannableSession(): Promise<boolean> {
    return await NativeModule.canStartNfcScannableSession();
  }

  public static async startScannableSession(): Promise<void> {
    await NativeModule.startScannableSession();
  }

  public static async startNfcScannableSession(): Promise<void> {
    await NativeModule.startNfcScannableSession();
  }

  public static async startQrCodeScannableSession(): Promise<void> {
    await NativeModule.startQrCodeScannableSession();
  }

  public static async fetch(tag: string): Promise<NotificareScannable> {
    return await NativeModule.fetch(tag);
  }

  //
  // Events
  //

  public static onScannableDetected(
    callback: (scannable: NotificareScannable) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.scannables.scannable_detected',
      callback
    );
  }

  public static onScannableSessionFailed(
    callback: (error: string | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.scannables.scannable_session_failed',
      callback
    );
  }
}
