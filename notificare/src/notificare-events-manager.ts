import { NativeModules } from 'react-native';
import type { Nullable } from './utils';

const { NotificareModule } = NativeModules;

export class NotificareEventsManager {
  static async logCustom(event: string, data?: Nullable<Record<string, any>>): Promise<void> {
    await NotificareModule.logCustom(event, data);
  }
}
