import { withNotificareAndroidServiceFile } from './withNotificareAndroidServicesFile';
import type { NotificarePluginProps } from '../types/types';
import type { ConfigPlugin } from 'expo/config-plugins';
import { withNotificareAndroidGradle } from './withNotificareAndroidGradle';
import { withNotificareAndroidMonitoring } from './withNotificareAndroidMonitoring';

export const withNotificareAndroid: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  config = withNotificareAndroidServiceFile(config, props);
  config = withNotificareAndroidGradle(config, props);
  config = withNotificareAndroidMonitoring(config, props);

  return config;
};
