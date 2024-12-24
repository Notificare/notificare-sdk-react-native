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

  /**
   * Indicates whether an NFC scannable session can be started on the current device.
   *
   * @returns `true` if the device supports NFC scanning, otherwise `false`.
   */
  public static async canStartNfcScannableSession(): Promise<boolean> {
    return await NativeModule.canStartNfcScannableSession();
  }

  /**
   * Starts a scannable session, automatically selecting the best scanning method
   * available.
   *
   * If NFC is available, it starts an NFC-based scanning session. If NFC is not
   * available, it defaults to starting a QR code scanning session.
   */
  public static async startScannableSession(): Promise<void> {
    await NativeModule.startScannableSession();
  }

  /**
   * Starts an NFC scannable session.
   *
   * Initiates an NFC-based scan, allowing the user to scan NFC tags. This will
   * only function on devices that support NFC and have it enabled.
   */
  public static async startNfcScannableSession(): Promise<void> {
    await NativeModule.startNfcScannableSession();
  }

  /**
   * Starts a QR code scannable session.
   *
   * Initiates a QR code-based scan using the device camera, allowing the user
   * to scan QR codes.
   */
  public static async startQrCodeScannableSession(): Promise<void> {
    await NativeModule.startQrCodeScannableSession();
  }

  /**
   * Fetches a scannable item by its tag.
   *
   * @param tag The tag identifier for the scannable item to be fetched.
   * @return The {@link NotificareScannable} object corresponding to the provided tag.
   */
  public static async fetch(tag: string): Promise<NotificareScannable> {
    return await NativeModule.fetch(tag);
  }

  //
  // Events
  //

  /**
   * Called when a scannable item is detected during a scannable session.
   *
   * This method is triggered when either an NFC tag or a QR code is successfully
   * scanned, and the corresponding [NotificareScannable] is retrieved. This
   * callback will be invoked on the main thread.
   *
   * @param callback A callback that will be invoked with the
   * result of the onScannableDetected event. It will provide the detected
   * {@link NotificareScannable}.
   */
  public static onScannableDetected(
    callback: (scannable: NotificareScannable) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.scannables.scannable_detected',
      callback
    );
  }

  /**
   * Called when an error occurs during a scannable session.
   *
   * This method is triggered if there's a failure while scanning or processing
   * the scannable item, either due to NFC or QR code scanning issues, or if the
   * scannable item cannot be retrieved. This callback will be invoked on the
   * main thread.
   *
   * @param callback A callback that will be invoked with the
   * result of the onScannableSessionFailed event. It will provide the error
   * that caused the session to fail, if it exists.
   */
  public static onScannableSessionFailed(
    callback: (error: string | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.scannables.scannable_session_failed',
      callback
    );
  }
}
