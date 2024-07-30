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

  public static async setAuthorizationOptions(
    options: string[]
  ): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setAuthorizationOptions(options);
    }
  }

  public static async setCategoryOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setCategoryOptions(options);
    }
  }

  public static async setPresentationOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NativeModule.setPresentationOptions(options);
    }
  }

  public static async hasRemoteNotificationsEnabled(): Promise<boolean> {
    return await NativeModule.hasRemoteNotificationsEnabled();
  }

  public static async getTransport(): Promise<NotificareTransport | null> {
    return await NativeModule.getTransport();
  }

  public static async getSubscriptionId(): Promise<string | null> {
    return await NativeModule.getSubscriptionId();
  }

  public static async allowedUI(): Promise<boolean> {
    return await NativeModule.allowedUI();
  }

  public static async enableRemoteNotifications(): Promise<void> {
    await NativeModule.enableRemoteNotifications();
  }

  public static async disableRemoteNotifications(): Promise<void> {
    await NativeModule.disableRemoteNotifications();
  }

  //
  // Events
  //

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

  public static onSystemNotificationReceived(
    callback: (notification: NotificareSystemNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.system_notification_received',
      callback
    );
  }

  public static onUnknownNotificationReceived(
    callback: (notification: Record<string, any>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.unknown_notification_received',
      callback
    );
  }

  public static onNotificationOpened(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_opened',
      callback
    );
  }

  public static onUnknownNotificationOpened(
    callback: (notification: Record<string, any>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.unknown_notification_opened',
      callback
    );
  }

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

  public static onNotificationSettingsChanged(
    callback: (granted: boolean) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.notification_settings_changed',
      callback
    );
  }

  public static onSubscriptionIdChanged(
    callback: (subscriptionId?: string | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.subscription_id_changed',
      callback
    );
  }

  public static onShouldOpenNotificationSettings(
    callback: (notification: NotificareNotification | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.should_open_notification_settings',
      callback
    );
  }

  public static onFailedToRegisterForRemoteNotifications(
    callback: (error: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.failed_to_register_for_remote_notifications',
      callback
    );
  }
}
