import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type {
  NotificareNotification,
  NotificareNotificationAction,
} from 'react-native-notificare';
import type { NotificareSystemNotification } from './models/notificare-system-notification';
import type { NotificareNotificationDeliveryMechanism } from './models/notificare-notification-delivery-mechanism';
import type { NotificareTransport } from './models/notificare-transport';
import type { NotificarePushSubscription } from './models/notificare-push-subscription';

const LINKING_ERROR =
  `The package 'react-native-notificare-push' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificarePushModule = isTurboModuleEnabled
  ? require('./NativeNotificarePushModule').default
  : NativeModules.NotificarePushModule;

const NativeModule = NotificarePushModule
  ? NotificarePushModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificarePush {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  /**
   * Defines the authorization options used when requesting push notification
   * permissions.
   *
   * @param options The authorization options to be set.
   */
  public static async setAuthorizationOptions(
    options: string[]
  ): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setAuthorizationOptions(options);
    }
  }

  /**
   * Defines the notification category options for custom notification actions.
   *
   * @param options The category options to be set
   */
  public static async setCategoryOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setCategoryOptions(options);
    }
  }

  /**
   * Defines the presentation options for displaying notifications while the app
   * is in the foreground.
   *
   * @param options The presentation options to be set.
   */
  public static async setPresentationOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setPresentationOptions(options);
    }
  }

  /**
   * Indicates whether remote notifications are enabled.
   *
   * @returns `true` if remote notifications are enabled for the application, and
   * `false` otherwise.
   */
  public static async hasRemoteNotificationsEnabled(): Promise<boolean> {
    return await NativeModule.hasRemoteNotificationsEnabled();
  }

  /**
   * Provides the current push transport information.
   *
   * @returns The {@link NotificareTransport} assigned to the device.
   */
  public static async getTransport(): Promise<NotificareTransport | null> {
    return await NativeModule.getTransport();
  }

  /**
   * Provides the current push subscription token.
   *
   * @returns the {@link NotificarePushSubscription} object containing the
   * device's current push subscription token, or `null` if no token is available.
   */
  public static async getSubscription(): Promise<NotificarePushSubscription | null> {
    return await NativeModule.getSubscription();
  }

  /**
   * Indicates whether the device is capable of receiving remote notifications.
   *
   * This function returns `true` if the user has granted permission to receive
   * push notifications and the device has successfully obtained a push token
   * from the notification service. It reflects whether the app can present
   * notifications as allowed by the system and user settings.
   *
   * @return `true` if the device can receive remote notifications, `false`
   * otherwise.
   */
  public static async allowedUI(): Promise<boolean> {
    return await NativeModule.allowedUI();
  }

  /**
   * Enables remote notifications.
   *
   * This function enables remote notifications for the application,
   * allowing push notifications to be received.
   *
   * **Note**: Starting with Android 13 (API level 33), this function requires
   * the developer to explicitly request the `POST_NOTIFICATIONS` permission from
   * the user.
   */
  public static async enableRemoteNotifications(): Promise<void> {
    await NativeModule.enableRemoteNotifications();
  }

  /**
   * Disables remote notifications.
   *
   * This function disables remote notifications for the application, preventing
   * push notifications from being received.
   */
  public static async disableRemoteNotifications(): Promise<void> {
    await NativeModule.disableRemoteNotifications();
  }

  //
  // Events
  //

  /**
   * Called when a push notification is received.
   *
   * Override to execute additional actions when a {@link NotificareNotification}
   * is received as indicated by the specified
   * {@link NotificareNotificationDeliveryMechanism}.
   *
   * @param callback A callback that will be invoked with the result of the
   * onNotificationInfoReceived event. It will provide the
   * {@link NotificareNotification} received and the
   * {@link NotificareNotificationDeliveryMechanism} used for its delivery.
   */
  public static onNotificationInfoReceived(
    callback: (data: {
      notification: NotificareNotification;
      deliveryMechanism: NotificareNotificationDeliveryMechanism;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_info_received',
      callback
    );
  }

  /**
   * Called when a custom system notification is received.
   *
   * @param callback A callback that will be invoked with the result of the
   * onSystemNotificationReceived event. It will provide the
   * {@link NotificareSystemNotification} received.
   */
  public static onSystemNotificationReceived(
    callback: (notification: NotificareSystemNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.system_notification_received',
      callback
    );
  }

  /**
   * Called when an unknown notification is received.
   *
   * @param callback A callback that will be invoked with the result of the
   * onUnknownNotificationReceived event. It will provide the unknown
   * notification received.
   */
  public static onUnknownNotificationReceived(
    callback: (notification: Record<string, any>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.unknown_notification_received',
      callback
    );
  }

  /**
   * Called when a push notification is opened by the user.
   *
   * @param callback A callback that will be invoked with the result of the
   * onNotificationOpened event. It will provide the
   * {@link NotificareNotification} that was opened.
   */
  public static onNotificationOpened(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_opened',
      callback
    );
  }

  /**
   * Called when a push notification action is opened by the user.
   *
   * @param callback A callback that will be invoked with the result of the
   * onUnknownNotificationOpened event. It will provide the unknown notification
   * that was opened.
   */
  public static onUnknownNotificationOpened(
    callback: (notification: Record<string, any>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.unknown_notification_opened',
      callback
    );
  }

  /**
   * Called when a push notification action is opened by the user.
   *
   * @param callback A callback that will be invoked with the result of the
   * onNotificationActionOpened event. It will provide the
   * {@link NotificareNotificationAction} opened by the user and the
   * {@link NotificareNotification} containing it.
   */
  public static onNotificationActionOpened(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_action_opened',
      callback
    );
  }

  /**
   * Called when a push notification action is opened by the user.
   *
   * @param callback A callback that will be invoked with the result of the
   * onUnknownNotificationActionOpened event. It will provide the
   * action opened by the user and the unknown notification containing it. It
   * will also provide a response text, if it exists.
   */
  public static onUnknownNotificationActionOpened(
    callback: (data: {
      notification: Record<string, any>;
      action: string;
      responseText: string | null;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.unknown_notification_action_opened',
      callback
    );
  }

  /**
   * Called when the notification settings are changed.
   * @param callback A callback that will be invoked with the result of the
   * onNotificationSettingsChanged event. It will provide a boolean indicating
   * whether the app is permitted to display notifications. `true` if
   * notifications are allowed, `false` if they are restricted by the user.
   */
  public static onNotificationSettingsChanged(
    callback: (granted: boolean) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_settings_changed',
      callback
    );
  }

  public static onSubscriptionChanged(
    callback: (subscription?: NotificarePushSubscription | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.subscription_changed',
      callback
    );
  }

  /**
   * Called when a notification prompts the app to open its settings screen.
   *
   * @param callback A callback that will be invoked with the result of the
   * onShouldOpenNotificationSettings event. It will provide the
   * {@link NotificareNotification} that prompted the app to open its settings
   * screen.
   */
  public static onShouldOpenNotificationSettings(
    callback: (notification: NotificareNotification | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.should_open_notification_settings',
      callback
    );
  }

  /**
   *  Called when the app encounters an error during the registration process for
   *
   * @param callback A callback that will be invoked with the result of the
   * onFailedToRegisterForRemoteNotifications event. IT will provide the error
   * that caused the registration to fail.
   */
  public static onFailedToRegisterForRemoteNotifications(
    callback: (error: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.failed_to_register_for_remote_notifications',
      callback
    );
  }
}
