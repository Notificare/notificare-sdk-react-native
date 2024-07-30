import type { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePushUIPluginProps } from '../types/types';
import { withNotificarePushUIIOSLocalizable } from './withNotificarePushUIIOSLocalizable';

export const withNotificarePushUIIOS: ConfigPlugin<
  NotificarePushUIPluginProps
> = (config, props) => {
  config = withNotificarePushUIIOSLocalizable(config, props);

  return config;
};
