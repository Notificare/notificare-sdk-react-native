import { NativeModules } from 'react-native';
import type { Nullable } from '../utils';
import type {
  NotificareDevice,
  NotificareDoNotDisturb,
  NotificareUserData,
} from '../models';

const NativeModule = NativeModules.NotificareDeviceManagerReactModule;

export class NotificareDeviceManager {
  async getCurrentDevice(): Promise<NotificareDevice> {
    return NativeModule.getCurrentDevice();
  }

  async register(
    userId: Nullable<string>,
    userName: Nullable<string>
  ): Promise<void> {
    await NativeModule.register(userId, userName);
  }

  async getPreferredLanguage(): Promise<Nullable<string>> {
    return NativeModule.getPreferredLanguage();
  }

  async updatePreferredLanguage(language: Nullable<string>) {
    await NativeModule.updatePreferredLanguage(language);
  }

  async fetchTags(): Promise<string[]> {
    return NativeModule.fetchTags();
  }

  async addTag(tag: string): Promise<void> {
    await NativeModule.addTag(tag);
  }

  async addTags(tags: string[]): Promise<void> {
    await NativeModule.addTags(tags);
  }

  async removeTag(tag: string): Promise<void> {
    await NativeModule.removeTag(tag);
  }

  async removeTags(tags: string[]): Promise<void> {
    await NativeModule.removeTags(tags);
  }

  async clearTags(): Promise<void> {
    await NativeModule.clearTags();
  }

  async fetchDoNotDisturb(): Promise<Nullable<NotificareDoNotDisturb>> {
    return NativeModule.fetchDoNotDisturb();
  }

  async updateDoNotDisturb(dnd: NotificareDoNotDisturb): Promise<void> {
    await NativeModule.updateDoNotDisturb(dnd);
  }

  async clearDoNotDisturb(): Promise<void> {
    await NativeModule.clearDoNotDisturb();
  }

  async fetchUserData(): Promise<Nullable<NotificareUserData>> {
    return NativeModule.fetchUserData();
  }

  async updateUserData(userData: NotificareUserData): Promise<void> {
    await NativeModule.updateUserData(userData);
  }
}
