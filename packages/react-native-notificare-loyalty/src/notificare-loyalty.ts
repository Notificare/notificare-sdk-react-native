import { NativeModules, Platform } from 'react-native';
import type { NotificarePass } from './models/notificare-pass';

const LINKING_ERROR =
  `The package 'react-native-notificare-loyalty' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareLoyaltyModule
  ? NativeModules.NotificareLoyaltyModule
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

  public static async fetchPassBySerial(
    serial: string
  ): Promise<NotificarePass> {
    return await NativeModule.fetchPassBySerial(serial);
  }

  public static async fetchPassByBarcode(
    barcode: string
  ): Promise<NotificarePass> {
    return await NativeModule.fetchPassByBarcode(barcode);
  }

  public static async present(pass: NotificarePass): Promise<void> {
    await NativeModule.present(pass);
  }
}
