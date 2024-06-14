import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { NotificarePass } from './models/notificare-pass';

export interface Spec extends TurboModule {
  fetchPassBySerial(serial: string): Promise<NotificarePass>;
  fetchPassByBarcode(barcode: string): Promise<NotificarePass>;
  present(pass: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NotificareLoyaltyModule'
);
