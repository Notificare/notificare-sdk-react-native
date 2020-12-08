import {
  NotificareDevice,
  NotificareDoNotDisturb,
  NotificareTime,
} from '../models';

export class NotificareDeviceAdapter {
  static fromJson(data: Record<string, any>): NotificareDevice {
    return {
      id: data.id,
      userId: data.userId,
      userName: data.userName,
      timeZoneOffset: data.timeZoneOffset,
      osVersion: data.osVersion,
      sdkVersion: data.sdkVersion,
      appVersion: data.appVersion,
      deviceString: data.deviceString,
      language: data.language,
      region: data.region,
      transport: data.transport,
      dnd: data.dnd && NotificareDoNotDisturbAdapter.fromJson(data.dnd),
      userData: data.userData,
      lastRegistered: new Date(data.lastRegistered),
    };
  }
}

export class NotificareDoNotDisturbAdapter {
  static fromJson(data: Record<string, any>): NotificareDoNotDisturb {
    return {
      start: new NotificareTime(data.start),
      end: new NotificareTime(data.end),
    };
  }

  static toJson(dnd: NotificareDoNotDisturb): object {
    return {
      start: dnd.start.toJSON(),
      end: dnd.end.toJSON(),
    };
  }
}
