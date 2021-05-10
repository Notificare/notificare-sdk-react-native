import type { NotificareNotification } from 'react-native-notificare';
import type { Nullable } from 'react-native-notificare/lib/typescript/utils';

export interface NotificareInboxItem {
  readonly id: string;
  readonly notification: NotificareNotification;
  readonly time: string; // ISO string
  readonly opened: boolean;
  readonly expires: Nullable<string>; // ISO string
}
