import { NativeModules, Platform } from 'react-native';
import type { NotificareUserInboxResponse } from './models/notificare-user-inbox-response';
import type { NotificareUserInboxItem } from './models/notificare-user-inbox-item';
import type { NotificareNotification } from 'react-native-notificare';

const LINKING_ERROR =
  `The package 'react-native-notificare-user-inbox' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareUserInboxModule
  ? NativeModules.NotificareUserInboxModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareUserInbox {
  //
  // Methods
  //

  public static async parseResponseFromJson(
    json: Record<string, any>
  ): Promise<NotificareUserInboxResponse> {
    return await NativeModule.parseResponseFromJson(json);
  }

  public static async parseResponseFromString(
    json: String
  ): Promise<NotificareUserInboxResponse> {
    return await NativeModule.parseResponseFromString(json);
  }

  public static async open(
    item: NotificareUserInboxItem
  ): Promise<NotificareNotification> {
    return await NativeModule.open(item);
  }

  public static async markAsRead(item: NotificareUserInboxItem): Promise<void> {
    return await NativeModule.open(item);
  }

  public static async remove(item: NotificareUserInboxItem): Promise<void> {
    return await NativeModule.remove(item);
  }
}
