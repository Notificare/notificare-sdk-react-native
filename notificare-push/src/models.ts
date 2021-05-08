import type { Nullable } from 'react-native-notificare/lib/typescript/utils';

export interface NotificareSystemNotification {
  readonly id: string;
  readonly type: string;
  readonly extra: Record<string, Nullable<string>>;
}
