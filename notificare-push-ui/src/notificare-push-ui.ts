import { NativeModules } from 'react-native';
import type { NotificareNotification, NotificareNotificationAction } from 'react-native-notificare';

const { NotificarePushUIModule } = NativeModules;

export class NotificarePushUI {
  // TODO events

  static async presentNotification(notification: NotificareNotification): Promise<void> {
    await NotificarePushUIModule.presentNotification(notification);
  }

  static async presentAction(
    notification: NotificareNotification,
    action: NotificareNotificationAction
  ): Promise<void> {
    await NotificarePushUIModule.presentAction(notification, action);
  }
}
