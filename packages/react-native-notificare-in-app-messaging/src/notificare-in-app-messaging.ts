import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type {
  NotificareInAppMessage,
  NotificareInAppMessageAction,
} from './models/notificare-in-app-message';

const LINKING_ERROR =
  `The package 'react-native-notificare-in-app-messaging' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareInAppMessagingModule = isTurboModuleEnabled
  ? require('./NativeNotificareInAppMessagingModule').default
  : NativeModules.NotificareInAppMessagingModule;

const NativeModule = NotificareInAppMessagingModule
  ? NotificareInAppMessagingModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareInAppMessaging {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async hasMessagesSuppressed(): Promise<boolean> {
    return await NativeModule.hasMessagesSuppressed();
  }

  public static async setMessagesSuppressed(
    suppressed: boolean,
    evaluateContext?: boolean
  ): Promise<void> {
    const data = {
      suppressed: suppressed,
      evaluateContext: evaluateContext,
    };

    await NativeModule.setMessagesSuppressed(data);
  }

  //
  // Events
  //

  public static onMessagePresented(
    callback: (message: NotificareInAppMessage) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.iam.message_presented',
      callback
    );
  }

  public static onMessageFinishedPresenting(
    callback: (message: NotificareInAppMessage) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.iam.message_finished_presenting',
      callback
    );
  }

  public static onMessageFailedToPresent(
    callback: (message: NotificareInAppMessage) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.iam.message_failed_to_present',
      callback
    );
  }

  public static onActionExecuted(
    callback: (data: {
      readonly message: NotificareInAppMessage;
      readonly action: NotificareInAppMessageAction;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.iam.action_executed',
      callback
    );
  }

  public static onActionFailedToExecute(
    callback: (data: {
      readonly message: NotificareInAppMessage;
      readonly action: NotificareInAppMessageAction;
      readonly error?: string | null;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.iam.action_failed_to_execute',
      callback
    );
  }
}
