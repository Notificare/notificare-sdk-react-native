import type { Nullable } from '../utils';

export interface NotificareDevice {
  id: string;
  userId?: Nullable<string>;
  userName?: Nullable<string>;
  timeZoneOffset: number;
  osVersion: string;
  sdkVersion: string;
  appVersion: string;
  deviceString: string;
  language: string;
  region: string;
  transport: string;
  dnd?: Nullable<NotificareDoNotDisturb>;
  userData?: Nullable<NotificareUserData>;
  lastRegistered: Date;
}

export interface NotificareDoNotDisturb {
  start: NotificareTime;
  end: NotificareTime;
}

export class NotificareTime {
  public readonly hours: number;
  public readonly minutes: number;

  constructor(time: string | { hours: number; minutes: number }) {
    let hours: number;
    let minutes: number;

    if (typeof time === 'string') {
      const parts = time.split(':');
      if (parts.length !== 2) {
        throw Error('Invalid time.');
      }

      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else if (typeof time === 'object') {
      hours = time.hours;
      minutes = time.minutes;
    } else {
      throw Error('Invalid time.');
    }

    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      throw Error(`Invalid time (hours): ${hours}`);
    }

    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      throw Error(`Invalid time (minutes): ${minutes}`);
    }

    this.hours = hours;
    this.minutes = minutes;
  }

  toString(): string {
    const hours = this.hours.toString(10).padStart(2, '0');
    const minutes = this.minutes.toString(10).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  toJSON(): string {
    return this.toString();
  }
}

export type NotificareUserData = Record<string, string>;
