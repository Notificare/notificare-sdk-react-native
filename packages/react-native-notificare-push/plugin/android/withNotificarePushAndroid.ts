import type { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePushPluginProps } from '../types/types';
import { withNotificarePushAndroidManifest } from './withNotificarePushAndroidManifest';
import { withNotificarePushAndroidNotification } from './withNotificarePushAndroidNotification';
import { withNotificarePushAndroidURLSchemes } from './withNotificarePushAndroidURLSchemes';

export const withNotificarePushAndroid: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withNotificarePushAndroidManifest(config, props);
  config = withNotificarePushAndroidNotification(config, props);
  config = withNotificarePushAndroidURLSchemes(config, props);

  return config;
};
