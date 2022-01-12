import type { NotificareNotification } from 'react-native-notificare';

export interface NotificareInboxItem {
  readonly id: string;
  readonly notification: NotificareNotification;
  readonly time: string;
  readonly opened: boolean;
  readonly expires?: string;
}
