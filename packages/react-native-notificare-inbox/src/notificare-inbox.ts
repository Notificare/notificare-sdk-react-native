import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareInboxItem } from './models/notificare-inbox-item';
import type { NotificareNotification } from 'react-native-notificare';

const LINKING_ERROR =
  `The package 'react-native-notificare-inbox' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareInboxModule
  ? NativeModules.NotificareInboxModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareInbox {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async getItems(): Promise<NotificareInboxItem[]> {
    return await NativeModule.getItems();
  }

  public static async getBadge(): Promise<number> {
    return await NativeModule.getBadge();
  }

  public static async refresh(): Promise<void> {
    await NativeModule.refresh();
  }

  public static async open(
    item: NotificareInboxItem
  ): Promise<NotificareNotification> {
    return await NativeModule.open(item);
  }

  public static async markAsRead(item: NotificareInboxItem): Promise<void> {
    await NativeModule.markAsRead(item);
  }

  public static async markAllAsRead(): Promise<void> {
    await NativeModule.markAllAsRead();
  }

  public static async remove(item: NotificareInboxItem): Promise<void> {
    await NativeModule.remove(item);
  }

  public static async clear(): Promise<void> {
    await NativeModule.clear();
  }

  //
  // Events
  //

  public static onInboxUpdated(
    callback: (items: NotificareInboxItem[]) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('inbox_updated', callback);
  }

  public static onBadgeUpdated(
    callback: (badge: number) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('badge_updated', callback);
  }
}
