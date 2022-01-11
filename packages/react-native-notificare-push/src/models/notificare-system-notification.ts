export interface NotificareSystemNotification {
  readonly id: string;
  readonly type: string;
  readonly extra: Record<string, string | null>;
}
