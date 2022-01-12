import { NativeModules, Platform } from 'react-native';
import type { NotificareAsset } from './models/notificare-asset';

const LINKING_ERROR =
  `The package 'react-native-notificare-assets' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareAssetsModule
  ? NativeModules.NotificareAssetsModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareAssets {
  //
  // Methods
  //

  public static async fetch(group: string): Promise<NotificareAsset[]> {
    return await NativeModule.fetch(group);
  }
}
