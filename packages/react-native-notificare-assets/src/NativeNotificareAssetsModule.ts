import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { NotificareAsset } from './models/notificare-asset';

export interface Spec extends TurboModule {
  //
  // Methods
  //

  fetch(group: string): Promise<NotificareAsset[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificareAssetsModule');
