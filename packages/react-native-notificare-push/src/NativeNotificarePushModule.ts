import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { NotificareTransport } from './models/notificare-transport';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  // region iOS only

  setAuthorizationOptions(options: string[]): Promise<void>;
  setCategoryOptions(options: string[]): Promise<void>;
  setPresentationOptions(options: string[]): Promise<void>;

  // end region

  hasRemoteNotificationsEnabled(): Promise<boolean>;
  transport(): Promise<NotificareTransport | null>;
  subscriptionId(): Promise<string | null>;
  allowedUI(): Promise<boolean>;
  enableRemoteNotifications(): Promise<void>;
  disableRemoteNotifications(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificarePushModule');
