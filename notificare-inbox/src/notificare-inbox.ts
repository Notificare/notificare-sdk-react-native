import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import type { NotificareInboxItem } from './models';
import type { NotificareNotification } from 'react-native-notificare';

const { NotificareInboxModule } = NativeModules;

export class NotificareInbox {
  private static eventEmitter = new NativeEventEmitter(NotificareInboxModule);

  static async getItems(): Promise<NotificareInboxItem[]> {
    return await NotificareInboxModule.getItems();
  }

  static async getBadge(): Promise<number> {
    return await NotificareInboxModule.getBadge();
  }

  static async refresh(): Promise<void> {
    await NotificareInboxModule.refresh();
  }

  static async open(item: NotificareInboxItem): Promise<NotificareNotification> {
    return await NotificareInboxModule.open(item);
  }

  static async markAsRead(item: NotificareInboxItem): Promise<void> {
    await NotificareInboxModule.markAsRead(item);
  }

  static async markAllAsRead(): Promise<void> {
    await NotificareInboxModule.markAllAsRead();
  }

  static async remove(item: NotificareInboxItem): Promise<void> {
    await NotificareInboxModule.remove(item);
  }

  static async clear(): Promise<void> {
    await NotificareInboxModule.clear();
  }

  static onInboxUpdated(callback: (items: NotificareInboxItem[]) => void): EmitterSubscription {
    return this.eventEmitter.addListener('inbox_updated', callback);
  }

  static onBadgeUpdated(callback: (badge: number) => void): EmitterSubscription {
    return this.eventEmitter.addListener('badge_updated', callback);
  }
}
