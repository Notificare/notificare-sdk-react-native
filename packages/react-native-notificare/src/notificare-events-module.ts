import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-notificare' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareModule
  ? NativeModules.NotificareModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareEventsModule {
  public async logCustom(event: string, data?: Record<string, any>) {
    await NativeModule.logCustom(event, data);
  }
}
