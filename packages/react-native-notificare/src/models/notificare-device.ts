import type { NotificareDoNotDisturb } from './notificare-do-not-disturb';

export interface NotificareDevice {
  readonly id: string;
  readonly userId?: string;
  readonly userName?: string;
  readonly timeZoneOffset: number;
  readonly osVersion: string;
  readonly sdkVersion: string;
  readonly appVersion: string;
  readonly deviceString: string;
  readonly language: string;
  readonly region: string;
  readonly transport: string;
  readonly dnd?: NotificareDoNotDisturb;
  readonly userData: Record<string, string>;
  readonly lastRegistered: string;
}
