import type { Nullable } from './utils';

export interface NotificareApplication {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly services: Record<string, boolean>;
  readonly inboxConfig: Nullable<NotificareApplicationInboxConfig>;
  readonly regionConfig: Nullable<NotificareApplicationRegionConfig>;
  readonly userDataFields: NotificareUserDataField[];
  readonly actionCategories: NotificareActionCategory[];
}

export interface NotificareApplicationInboxConfig {
  readonly useInbox: boolean;
  readonly autoBadge: boolean;
}

export interface NotificareApplicationRegionConfig {
  readonly proximityUUID: Nullable<string>;
}

export interface NotificareUserDataField {
  readonly type: string;
  readonly key: string;
  readonly label: string;
}

export interface NotificareActionCategory {
  readonly type: string;
  readonly name: string;
}

export interface NotificareDevice {
  readonly id: string;
  readonly userId: Nullable<string>;
  readonly userName: Nullable<string>;
  readonly timeZoneOffset: number;
  readonly osVersion: string;
  readonly sdkVersion: string;
  readonly appVersion: string;
  readonly deviceString: string;
  readonly language: string;
  readonly region: string;
  readonly transport: string;
  readonly dnd: Nullable<NotificareDoNotDisturb>;
  readonly userData: Nullable<Record<string, string>>;
  readonly lastRegistered: string; // ISO string
}

export interface NotificareDoNotDisturb {
  readonly start: string;
  readonly end: string;
}

export interface NotificareNotification {
  readonly id: string;
  readonly partial: boolean;
  readonly type: string;
  readonly time: string; // ISO string
  readonly title: Nullable<string>;
  readonly subtitle: Nullable<string>;
  readonly message: string;
  readonly content: NotificareNotificationContent[];
  readonly actions: NotificareNotificationAction[];
  readonly attachments: NotificareNotificationAttachment[];
  readonly extra: Record<string, any>;
}

export interface NotificareNotificationContent {
  readonly type: string;
  readonly data: any;
}

export interface NotificareNotificationAction {
  readonly type: string;
  readonly label: string;
  readonly target: Nullable<string>;
  readonly keyboard: boolean;
  readonly camera: boolean;
}

export interface NotificareNotificationAttachment {
  readonly mimeType: string;
  readonly uri: string;
}
