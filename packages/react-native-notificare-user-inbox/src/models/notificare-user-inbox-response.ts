import type { NotificareUserInboxItem } from './notificare-user-inbox-item';

export interface NotificareUserInboxResponse {
  readonly count: number;
  readonly unread: number;
  readonly items: NotificareUserInboxItem[];
}
