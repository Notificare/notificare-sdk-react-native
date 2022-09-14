export interface NotificareInAppMessage {
  readonly id: string;
  readonly identifier: string;
  readonly name: string;
  readonly type: string;
  readonly context?: string[] | null;
  readonly title?: string | null;
  readonly message?: string | null;
  readonly image?: string | null;
  readonly landscapeImage?: string | null;
  readonly delaySeconds: number;
  readonly primaryAction?: NotificareInAppMessageAction | null;
  readonly secondaryAction?: NotificareInAppMessageAction | null;
}

export interface NotificareInAppMessageAction {
  readonly label?: string | null;
  readonly destructive: boolean;
  readonly url?: string | null;
}
