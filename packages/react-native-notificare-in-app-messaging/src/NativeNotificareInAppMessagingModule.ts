import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  hasMessagesSuppressed(): Promise<boolean>;
  setMessagesSuppressed(data: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NotificareInAppMessagingModule'
);
