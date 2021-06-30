import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import type { NotificareApplication, NotificareDevice, NotificareNotification } from './models';
import type { Nullable } from './utils';
import { NotificareDeviceManager } from './notificare-device-manager';
import { NotificareEventsManager } from './notificare-events-manager';

const { NotificareModule } = NativeModules;

export class Notificare {
  private static eventEmitter = new NativeEventEmitter(NotificareModule);

  static readonly deviceManager = NotificareDeviceManager;
  static readonly eventsManager = NotificareEventsManager;

  static async isConfigured(): Promise<boolean> {
    return await NotificareModule.getConfigured();
  }

  static async isReady(): Promise<boolean> {
    return await NotificareModule.getReady();
  }

  static async getUseAdvancedLogging(): Promise<boolean> {
    return await NotificareModule.getUseAdvancedLogging();
  }

  static async setUseAdvancedLogging(useAdvancedLogging: boolean): Promise<void> {
    await NotificareModule.setUseAdvancedLogging(useAdvancedLogging);
  }

  static async configure(applicationKey: string, applicationSecret: string): Promise<void> {
    await NotificareModule.configure(applicationKey, applicationSecret);
  }

  static async launch(): Promise<void> {
    await NotificareModule.launch();
  }

  static async unlaunch(): Promise<void> {
    await NotificareModule.unlaunch();
  }

  static async getApplication(): Promise<Nullable<NotificareApplication>> {
    return await NotificareModule.getApplication();
  }

  static async fetchApplication(): Promise<NotificareApplication> {
    return await NotificareModule.fetchApplication();
  }

  static async fetchNotification(id: string): Promise<NotificareNotification> {
    return await NotificareModule.fetchNotification(id);
  }

  static onReady(callback: (application: NotificareApplication) => void): EmitterSubscription {
    return this.eventEmitter.addListener('ready', callback);
  }

  static onDeviceRegistered(callback: (device: NotificareDevice) => void): EmitterSubscription {
    return this.eventEmitter.addListener('device_registered', callback);
  }

  static onUrlOpened(callback: (url: string) => void): EmitterSubscription {
    return this.eventEmitter.addListener('url_opened', callback);
  }
}
