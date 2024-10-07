import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { NotificareRegion } from './models/notificare-region';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  hasLocationServicesEnabled(): Promise<boolean>;
  hasBluetoothEnabled(): Promise<boolean>;
  getMonitoredRegions(): Promise<NotificareRegion[]>;
  getEnteredRegions(): Promise<NotificareRegion[]>;
  enableLocationUpdates(): Promise<void>;
  disableLocationUpdates(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificareGeoModule');
