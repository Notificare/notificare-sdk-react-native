import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareSystemNotification } from './models/notificare-system-notification';
import type {
  NotificareNotification,
  NotificareNotificationAction,
} from 'react-native-notificare';

const LINKING_ERROR =
  `The package 'react-native-notificare-push' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificarePushModule
  ? NativeModules.NotificarePushModule
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

  public static onNotificationReceived(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('notification_received', callback);
  }

  public static onSystemNotificationReceived(
    callback: (notification: NotificareSystemNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'system_notification_received',
      callback
    );
  }

  public static onUnknownNotificationReceived(
    callback: (notification: Record<string, any>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'unknown_notification_received',
      callback
    );
  }

  public static onNotificationOpened(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('notification_opened', callback);
  }

  public static onNotificationActionOpened(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'notification_action_opened',
      callback
    );
  }

  public static onNotificationSettingsChanged(
    callback: (granted: boolean) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'notification_settings_changed',
      callback
    );
  }

  public static onShouldOpenNotificationSettings(
    callback: (notification: NotificareNotification | null) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'should_open_notification_settings',
      callback
    );
  }

  public static onFailedToRegisterForRemoteNotifications(
    callback: (error: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'failed_to_register_for_remote_notifications',
      callback
    );
  }
}
