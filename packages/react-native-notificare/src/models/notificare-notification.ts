export interface NotificareNotification {
  readonly id: string;
  readonly partial: boolean;
  readonly type: string;
  readonly time: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly message: string;
  readonly content: NotificareNotificationContent[];
  readonly actions: NotificareNotificationAction[];
  readonly attachments: NotificareNotificationAttachment[];
  readonly extra: Record<string, any>;
  readonly targetContentIdentifier?: string;
}

export interface NotificareNotificationContent {
  readonly type: string;
  readonly data: any;
}

export interface NotificareNotificationAction {
  readonly type: string;
  readonly label: string;
  readonly target?: string;
  readonly keyboard: boolean;
  readonly camera: boolean;
  readonly destructive?: boolean;
  readonly icon?: NotificareNotificationActionIcon;
}

export interface NotificareNotificationActionIcon {
  readonly android?: string;
  readonly ios?: string;
  readonly web?: string;
}

export interface NotificareNotificationAttachment {
  readonly mimeType: string;
  readonly uri: string;
}
