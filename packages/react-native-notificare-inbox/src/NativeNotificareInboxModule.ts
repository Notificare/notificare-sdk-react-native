import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { NotificareInboxItem } from './models/notificare-inbox-item';
import type { NotificareNotification } from 'react-native-notificare';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  getItems(): Promise<NotificareInboxItem[]>;
  getBadge(): Promise<number>;
  refresh(): Promise<void>;
  open(item: Object): Promise<NotificareNotification>;
  markAsRead(item: Object): Promise<void>;
  markAllAsRead(): Promise<void>;
  remove(item: Object): Promise<void>;
  clear(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificareInboxModule');
