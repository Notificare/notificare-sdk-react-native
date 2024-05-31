import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { NotificareUserInboxResponse } from './models/notificare-user-inbox-response';
import type { NotificareNotification } from 'react-native-notificare';

export interface Spec extends TurboModule {
  parseResponseFromJson(json: Object): Promise<NotificareUserInboxResponse>;
  parseResponseFromString(json: string): Promise<NotificareUserInboxResponse>;
  open(item: Object): Promise<NotificareNotification>;
  markAsRead(item: Object): Promise<void>;
  remove(item: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NotificareUserInboxModule'
);
