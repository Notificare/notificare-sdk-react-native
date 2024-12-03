import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-notificare' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareModule = isTurboModuleEnabled
  ? require('./NativeNotificareModule').default
  : NativeModules.NotificareModule;

const NativeModule = NotificareModule
  ? NotificareModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareEventsModule {
  /**
   * Logs in Notificare a custom event in the application.
   *
   * This function allows logging, in Notificare, of application-specific events,
   * optionally associating structured data for more detailed event tracking and
   * analysis.
   *
   * @param event The name of the custom event to log.
   * @param data Optional structured event data for further details.
   */
  public async logCustom(
    event: string,
    data?: Record<string, any>
  ): Promise<void> {
    await NativeModule.logCustom(event, data);
  }
}
