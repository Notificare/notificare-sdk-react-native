import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { NotificareDeviceManager } from './modules/device-manager';
import type { NotificareDevice } from './models';

const NotificareModule = NativeModules.NotificareReactModule;

export class Notificare {
  private static eventEmitter = new NativeEventEmitter(NotificareModule);

  // Modules
  static deviceManager = new NotificareDeviceManager();

  static async isConfigured(): Promise<boolean> {
    return NotificareModule.getConfigured();
  }

  static async isReady(): Promise<boolean> {
    return NotificareModule.getReady();
  }

  static async configure(applicationKey: string, applicationSecret: string) {
    await NotificareModule.configure(applicationKey, applicationSecret);
  }

  static async launch() {
    await NotificareModule.launch();
  }

  static async unlaunch() {
    await NotificareModule.unlaunch();
  }

  static onReady(callback: () => void): EmitterSubscription {
    return this.eventEmitter.addListener('ready', callback);
  }

  static onDeviceRegistered(
    callback: (device: NotificareDevice) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener('device_registered', callback);
  }
}

export default Notificare;
