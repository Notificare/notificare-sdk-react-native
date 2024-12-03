import { NativeModules, Platform } from 'react-native';
import type { NotificarePass } from './models/notificare-pass';

const LINKING_ERROR =
  `The package 'react-native-notificare-loyalty' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareLoyaltyModule = isTurboModuleEnabled
  ? require('./NativeNotificareLoyaltyModule').default
  : NativeModules.NotificareLoyaltyModule;

const NativeModule = NotificareLoyaltyModule
  ? NotificareLoyaltyModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareLoyalty {
  //
  // Methods
  //

  /**
   * Fetches a pass by its serial number.
   *
   * @param serial The serial number of the pass to be fetched.
   * @return The fetched {@link NotificarePass} corresponding to the given serial
   * number.
   */
  public static async fetchPassBySerial(
    serial: string
  ): Promise<NotificarePass> {
    return await NativeModule.fetchPassBySerial(serial);
  }

  /**
   * Fetches a pass by its barcode.
   *
   * @param barcode The barcode of the pass to be fetched.
   * @return The fetched {@link NotificarePass} corresponding to the given
   * barcode.
   */
  public static async fetchPassByBarcode(
    barcode: string
  ): Promise<NotificarePass> {
    return await NativeModule.fetchPassByBarcode(barcode);
  }

  /**
   * Presents a pass to the user.
   *
   * @param pass The {@link NotificarePass} to be presented to the user.
   */
  public static async present(pass: NotificarePass): Promise<void> {
    await NativeModule.present(pass);
  }
}
