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

const LINKING_ERROR =
  `The package 'react-native-notificare-push-ui' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificarePushUIModule = isTurboModuleEnabled
  ? require('./NativeNotificarePushUIModule').default
  : NativeModules.NotificarePushUIModule;

const NativeModule = NotificarePushUIModule
  ? NotificarePushUIModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificarePushUI {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async presentNotification(
    notification: NotificareNotification
  ): Promise<void> {
    await NativeModule.presentNotification(notification);
  }

  public static async presentAction(
    notification: NotificareNotification,
    action: NotificareNotificationAction
  ): Promise<void> {
    await NativeModule.presentAction(notification, action);
  }

  //
  // Events
  //

  static onNotificationWillPresent(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.notification_will_present',
      callback
    );
  }

  static onNotificationPresented(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.notification_presented',
      callback
    );
  }

  static onNotificationFinishedPresenting(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.notification_finished_presenting',
      callback
    );
  }

  static onNotificationFailedToPresent(
    callback: (notification: NotificareNotification) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.notification_failed_to_present',
      callback
    );
  }

  static onNotificationUrlClicked(
    callback: (data: {
      notification: NotificareNotification;
      url: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.notification_url_clicked',
      callback
    );
  }

  static onActionWillExecute(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.action_will_execute',
      callback
    );
  }

  static onActionExecuted(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.action_executed',
      callback
    );
  }

  static onActionNotExecuted(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.action_not_executed',
      callback
    );
  }

  static onActionFailedToExecute(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
      error?: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.action_failed_to_execute',
      callback
    );
  }

  static onCustomActionReceived(
    callback: (data: {
      notification: NotificareNotification;
      action: NotificareNotificationAction;
      url: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.push.ui.custom_action_received',
      callback
    );
  }
}
