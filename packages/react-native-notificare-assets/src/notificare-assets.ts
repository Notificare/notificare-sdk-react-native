import { NativeModules, Platform } from 'react-native';
import type { NotificareAsset } from './models/notificare-asset';

const LINKING_ERROR =
  `The package 'react-native-notificare-assets' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareAssetsModule = isTurboModuleEnabled
  ? require('./NativeNotificareAssetsModule').default
  : NativeModules.NotificareAssetsModule;

const NativeModule = NotificareAssetsModule
  ? NotificareAssetsModule
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

  /**
   * Fetches a list of {@link NotificareAsset} for a specified group.
   *
   * @param {string} group - The name of the group whose assets are to be fetched.
   * @returns {Promise<NotificareAsset[]>} - A promise that resolves to a list of
   * {@link NotificareAsset} belonging to the specified group.
   */
  public static async fetch(group: string): Promise<NotificareAsset[]> {
    return await NativeModule.fetch(group);
  }
}
