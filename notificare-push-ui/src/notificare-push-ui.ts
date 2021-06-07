import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import type { NotificareNotification, NotificareNotificationAction } from 'react-native-notificare';
import type {
  ActionExecutedEvent,
  ActionFailedToExecuteEvent,
  ActionNotExecutedEvent,
  ActionWillExecuteEvent,
  NotificationUrlClickedEvent,
} from './models';

const { NotificarePushUIModule } = NativeModules;

export class NotificarePushUI {
  private static readonly eventEmitter = new NativeEventEmitter(NotificarePushUIModule);

  static async presentNotification(notification: NotificareNotification): Promise<void> {
    await NotificarePushUIModule.presentNotification(notification);
  }

  static async presentAction(
    notification: NotificareNotification,
    action: NotificareNotificationAction
  ): Promise<void> {
    await NotificarePushUIModule.presentAction(notification, action);
  }

  // region Events

  static onNotificationWillPresent(callback: (notification: NotificareNotification) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_will_present', callback);
  }

  static onNotificationPresented(callback: (notification: NotificareNotification) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_presented', callback);
  }

  static onNotificationFinishedPresenting(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('notification_finished_presenting', callback);
  }

  static onNotificationFailedToPresent(callback: (notification: NotificareNotification) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_failed_to_present', callback);
  }

  static onNotificationUrlClicked(callback: (data: NotificationUrlClickedEvent) => void): EmitterSubscription {
    return this.eventEmitter.addListener('notification_url_clicked', callback);
  }

  static onActionWillExecute(callback: (data: ActionWillExecuteEvent) => void): EmitterSubscription {
    return this.eventEmitter.addListener('action_will_execute', callback);
  }

  static onActionExecuted(callback: (data: ActionExecutedEvent) => void): EmitterSubscription {
    return this.eventEmitter.addListener('action_executed', callback);
  }

  static onActionNotExecuted(callback: (data: ActionNotExecutedEvent) => void): EmitterSubscription {
    return this.eventEmitter.addListener('action_not_executed', callback);
  }

  static onActionFailedToExecute(callback: (data: ActionFailedToExecuteEvent) => void): EmitterSubscription {
    return this.eventEmitter.addListener('action_failed_to_execute', callback);
  }

  static onCustomActionReceived(callback: (url: string) => void): EmitterSubscription {
    return this.eventEmitter.addListener('custom_action_received', callback);
  }

  // endregion
}
