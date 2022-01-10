import type { NotificareNotificationAction } from './notificare-notification';

export interface NotificareApplication {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly services: Record<string, boolean>;
  readonly inboxConfig?: NotificareInboxConfig;
  readonly regionConfig?: NotificareRegionConfig;
  readonly userDataFields: NotificareUserDataField[];
  readonly actionCategories: NotificareActionCategory[];
}

export interface NotificareInboxConfig {
  readonly useInbox: boolean;
  readonly autoBadge: boolean;
}

export interface NotificareRegionConfig {
  readonly proximityUUID?: string;
}

export interface NotificareUserDataField {
  readonly type: string;
  readonly key: string;
  readonly label: string;
}

export interface NotificareActionCategory {
  readonly type: string;
  readonly name: string;
  readonly description?: string;
  readonly actions: NotificareNotificationAction[];
}
