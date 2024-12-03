import {
  type EmitterSubscription,
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
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareInboxModule = isTurboModuleEnabled
  ? require('./NativeNotificareInboxModule').default
  : NativeModules.NotificareInboxModule;

const NativeModule = NotificareInboxModule
  ? NotificareInboxModule
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

  /**
   * @returns A list of all {@link NotificareInboxItem}, sorted by the timestamp.
   */
  public static async getItems(): Promise<NotificareInboxItem[]> {
    return await NativeModule.getItems();
  }

  /**
   * @returns The current badge count, representing the number of unread inbox
   * items.
   */
  public static async getBadge(): Promise<number> {
    return await NativeModule.getBadge();
  }

  /**
   * Refreshes the inbox data, ensuring the items and badge count reflect the
   * latest server state.
   */
  public static async refresh(): Promise<void> {
    await NativeModule.refresh();
  }

  /**
   * Opens a specified inbox item, marking it as read and returning the
   * associated notification.
   *
   * @param item The {@link NotificareInboxItem} to open.
   * @return The {@link NotificareNotification} associated with the inbox item.
   */
  public static async open(
    item: NotificareInboxItem
  ): Promise<NotificareNotification> {
    return await NativeModule.open(item);
  }

  /**
   * Marks the specified inbox item as read.
   *
   * @param item The {@link NotificareInboxItem} to mark as read.
   */
  public static async markAsRead(item: NotificareInboxItem): Promise<void> {
    await NativeModule.markAsRead(item);
  }

  /**
   * Marks all inbox items as read.
   */
  public static async markAllAsRead(): Promise<void> {
    await NativeModule.markAllAsRead();
  }

  /**
   * Permanently removes the specified inbox item from the inbox.
   *
   * @param item The {@link NotificareInboxItem} to remove.
   */
  public static async remove(item: NotificareInboxItem): Promise<void> {
    await NativeModule.remove(item);
  }

  /**
   * Clears all inbox items, permanently deleting them from the inbox.
   */
  public static async clear(): Promise<void> {
    await NativeModule.clear();
  }

  //
  // Events
  //

  /**
   * Called when the inbox is successfully updated.
   *
   * @param callback A callback that will be invoked with the result of the
   * onInboxUpdated event. It will provide an updated list of
   * {@link NotificareInboxItem}.
   */
  public static onInboxUpdated(
    callback: (items: NotificareInboxItem[]) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.inbox.inbox_updated',
      callback
    );
  }

  /**
   * Called when the unread message count badge is updated.
   *
   * @param callback A callback that will be invoked with the
   * result of the onBadgeUpdated event. It will provide an updated badge count,
   * representing current the number of unread inbox items.
   */
  public static onBadgeUpdated(
    callback: (badge: number) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.inbox.badge_updated',
      callback
    );
  }
}
