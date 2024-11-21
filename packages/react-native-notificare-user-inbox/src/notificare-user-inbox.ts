import { NativeModules, Platform } from 'react-native';
import type { NotificareUserInboxResponse } from './models/notificare-user-inbox-response';
import type { NotificareNotification } from 'react-native-notificare';
import type { NotificareUserInboxItem } from './models/notificare-user-inbox-item';

const LINKING_ERROR =
  `The package 'react-native-notificare-user-inbox' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareUserInboxModule = isTurboModuleEnabled
  ? require('./NativeNotificareUserInboxModule').default
  : NativeModules.NotificareUserInboxModule;

const NativeModule = NotificareUserInboxModule
  ? NotificareUserInboxModule
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

  /**
   * Parses a JSON {@link Record} to produce a {@link NotificareUserInboxResponse}.
   *
   * This method takes a raw JSON {@link Record} and converts it into a structured
   * {@link NotificareUserInboxResponse}.
   *
   * @param json The JSON Record representing the user inbox response.
   * @return A {@link NotificareUserInboxResponse} object parsed from the
   * provided JSON string.
   */
  public static async parseResponseFromJson(
    json: Record<string, any>
  ): Promise<NotificareUserInboxResponse> {
    return await NativeModule.parseResponseFromJson(json);
  }

  /**
   * Parses a JSON string to produce a {@link NotificareUserInboxResponse}.
   *
   * This method takes a raw JSON string and converts it into a structured
   * {@link NotificareUserInboxResponse}.
   *
   * @param json The JSON string representing the user inbox response.
   * @return A {@link NotificareUserInboxResponse} object parsed from the
   * provided JSON string.
   */
  public static async parseResponseFromString(
    json: string
  ): Promise<NotificareUserInboxResponse> {
    return await NativeModule.parseResponseFromString(json);
  }

  /**
   * Opens an inbox item and retrieves its associated notification.
   *
   * This is a suspending function that opens the provided
   * {@link NotificareUserInboxItem} and returns the associated
   * {@link NotificareNotification}. This operation marks the item as read.
   *
   * @param item The {@link NotificareUserInboxItem} to be opened.
   * @return The {@link NotificareNotification} associated with the opened inbox
   * item.
   */
  public static async open(
    item: NotificareUserInboxItem
  ): Promise<NotificareNotification> {
    return await NativeModule.open(item);
  }

  /**
   * Marks an inbox item as read.
   *
   * This is a suspending function that updates the status of the provided
   * {@link NotificareUserInboxItem} to read.
   *
   * @param item The {@link NotificareUserInboxItem} to mark as read.
   */
  public static async markAsRead(item: NotificareUserInboxItem): Promise<void> {
    return await NativeModule.markAsRead(item);
  }

  /**
   * Removes an inbox item from the user's inbox.
   *
   * This is a suspending function that deletes the provided
   * {@link NotificareUserInboxItem} from the user's inbox.
   *
   * @param item The {@link NotificareUserInboxItem} to be removed.
   */
  public static async remove(item: NotificareUserInboxItem): Promise<void> {
    return await NativeModule.remove(item);
  }
}
