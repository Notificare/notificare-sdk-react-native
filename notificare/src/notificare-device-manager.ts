import { NativeModules } from 'react-native';
import type { NotificareDevice, NotificareDoNotDisturb } from './models';
import type { Nullable } from './utils';

const { NotificareModule } = NativeModules;

export class NotificareDeviceManager {
  static async getCurrentDevice(): Promise<Nullable<NotificareDevice>> {
    return await NotificareModule.getCurrentDevice();
  }

  static async getPreferredLanguage(): Promise<Nullable<string>> {
    return await NotificareModule.getPreferredLanguage();
  }

  static async updatePreferredLanguage(language: Nullable<string>): Promise<void> {
    await NotificareModule.updatePreferredLanguage(language);
  }

  static async register(userId: Nullable<string>, userName: Nullable<string>): Promise<void> {
    await NotificareModule.register(userId, userName);
  }

  static async fetchTags(): Promise<string[]> {
    return await NotificareModule.fetchTags();
  }

  static async addTag(tag: string): Promise<void> {
    await NotificareModule.addTag(tag);
  }

  static async addTags(tags: string[]): Promise<void> {
    await NotificareModule.addTags(tags);
  }

  static async removeTag(tag: string): Promise<void> {
    await NotificareModule.removeTag(tag);
  }

  static async removeTags(tags: string[]): Promise<void> {
    await NotificareModule.removeTags(tags);
  }

  static async clearTags(): Promise<void> {
    await NotificareModule.clearTags();
  }

  static async fetchDoNotDisturb(): Promise<Nullable<NotificareDoNotDisturb>> {
    return await NotificareModule.fetchDoNotDisturb();
  }

  static async updateDoNotDisturb(dnd: NotificareDoNotDisturb): Promise<void> {
    await NotificareModule.updateDoNotDisturb(dnd);
  }

  static async clearDoNotDisturb(): Promise<void> {
    await NotificareModule.clearDoNotDisturb();
  }

  static async fetchUserData(): Promise<Nullable<Record<string, string>>> {
    return await NotificareModule.fetchUserData();
  }

  static async updateUserData(userData: Record<string, string>): Promise<void> {
    await NotificareModule.updateUserData(userData);
  }
}
