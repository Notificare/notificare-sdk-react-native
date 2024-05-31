import { NativeModules, Platform } from 'react-native';
import type { NotificareDevice } from './models/notificare-device';
import type { NotificareDoNotDisturb } from './models/notificare-do-not-disturb';

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

export class NotificareDeviceModule {
  public async getCurrentDevice(): Promise<NotificareDevice | null> {
    return await NativeModule.getCurrentDevice();
  }

  public async getPreferredLanguage(): Promise<string | null> {
    return await NativeModule.getPreferredLanguage();
  }

  public async updatePreferredLanguage(language: string | null): Promise<void> {
    await NativeModule.updatePreferredLanguage(language);
  }

  public async register(
    userId: string | null,
    userName: string | null
  ): Promise<void> {
    await NativeModule.registerUser(userId, userName);
  }

  public async fetchTags(): Promise<string[]> {
    return await NativeModule.fetchTags();
  }

  public async addTag(tag: string): Promise<void> {
    await NativeModule.addTag(tag);
  }

  public async addTags(tags: string[]): Promise<void> {
    await NativeModule.addTags(tags);
  }

  public async removeTag(tag: string): Promise<void> {
    await NativeModule.removeTag(tag);
  }

  public async removeTags(tags: string[]): Promise<void> {
    await NativeModule.removeTags(tags);
  }

  public async clearTags(): Promise<void> {
    await NativeModule.clearTags();
  }

  public async fetchDoNotDisturb(): Promise<NotificareDoNotDisturb | null> {
    return await NativeModule.fetchDoNotDisturb();
  }

  public async updateDoNotDisturb(dnd: NotificareDoNotDisturb): Promise<void> {
    await NativeModule.updateDoNotDisturb(dnd);
  }

  public async clearDoNotDisturb(): Promise<void> {
    await NativeModule.clearDoNotDisturb();
  }

  public async fetchUserData(): Promise<Record<string, string>> {
    return await NativeModule.fetchUserData();
  }

  public async updateUserData(userData: Record<string, string>): Promise<void> {
    await NativeModule.updateUserData(userData);
  }
}
