import type { NotificareDoNotDisturb } from './notificare-do-not-disturb';

export interface NotificareDevice {
  readonly id: string;
  readonly userId?: string;
  readonly userName?: string;
  readonly timeZoneOffset: number;
  readonly dnd?: NotificareDoNotDisturb;
  readonly userData: Record<string, string>;
}
