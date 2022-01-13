export interface NotificareBeacon {
  readonly id: string;
  readonly name: string;
  readonly major: number;
  readonly minor?: number;
  readonly triggers: boolean;
  readonly proximity: string;
}
