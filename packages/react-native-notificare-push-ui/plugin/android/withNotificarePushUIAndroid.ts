import type { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePushUIPluginProps } from '../types/types';
import { withNotificarePushUIAndroidStyle } from './withNotificarePushUIAndroidStyle';
import { withNotificarePushUIAndroidLocalizable } from './withNotificarePushUIAndroidLocalizable';

export const withNotificarePushUIAndroid: ConfigPlugin<
  NotificarePushUIPluginProps
> = (config, props) => {
  config = withNotificarePushUIAndroidStyle(config, props);
  config = withNotificarePushUIAndroidLocalizable(config, props);

  return config;
};
