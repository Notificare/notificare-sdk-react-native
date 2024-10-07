import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  presentNotification(notification: Object): Promise<void>;
  presentAction(notification: Object, action: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificarePushUIModule');
