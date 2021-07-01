import type { EmitterSubscription } from 'react-native';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { NotificareNotification, NotificareNotificationAction } from 'react-native-notificare';
import type { NotificareSystemNotification } from './models';
import type { Nullable } from 'react-native-notificare/lib/typescript/utils';

const { NotificarePushModule } = NativeModules;

export class NotificarePush {
  private static readonly eventEmitter = new NativeEventEmitter(NotificarePushModule);

  static async setAuthorizationOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NotificarePushModule.setAuthorizationOptions(options);
    }
  }

  static async setCategoryOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NotificarePushModule.setCategoryOptions(options);
    }
  }

  static async setPresentationOptions(options: string[]): Promise<void> {
    if (Platform.OS === 'ios') {
      await NotificarePushModule.setPresentationOptions(options);
    }
  }

  static async isRemoteNotificationsEnabled(): Promise<boolean> {
    return await NotificarePushModule.isRemoteNotificationsEnabled();
  }

  static async isAllowedUI(): Promise<boolean> {
    return await NotificarePushModule.isAllowedUI();
  }

  static async enableRemoteNotifications(): Promise<void> {
    await NotificarePushModule.enableRemoteNotifications();
  }

  static async disableRemoteNotifications(): Promise<void> {
    await NotificarePushModule.disableRemoteNotifications();
  }

  // region Events

  static onNotificationReceived(callback: (notification: NotificareNotification) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_received', callback);
  }

  static onSystemNotificationReceived(
    callback: (notification: NotificareSystemNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('system_notification_received', callback);
  }

  static onUnknownNotificationReceived(callback: (notification: Record<any, any>) => void): EmitterSubscription {
    return this.eventEmitter.addListener('unknown_notification_received', callback);
  }

  static onNotificationOpened(callback: (notification: NotificareNotification) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_opened', callback);
  }

  static onNotificationActionOpened(
    callback: (data: { notification: NotificareNotification; action: NotificareNotificationAction }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('notification_action_opened', callback);
  }

  static onNotificationSettingsChanged(callback: (granted: boolean) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_settings_changed', callback);
  }

  static onShouldOpenNotificationSettings(
    callback: (notification: Nullable<NotificareNotification>) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('should_open_notification_settings', callback);
  }

  static onFailedToRegisterForRemoteNotifications(callback: (error: string) => void): EmitterSubscription {
    return this.eventEmitter.addListener('failed_to_register_for_remote_notifications', callback);
  }

  // endregion
}
