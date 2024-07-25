import type { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePushPluginProps } from '../types/types';
import { withNotificarePushIOSCapabilities } from './withNotificarePushIOSCapabilities';
import { withNotificarePushIOSEnvironment } from './withNotificarePushIOSEnvironment';
import { withNotificarePushIOSNotificationServiceExtension } from './withNotificarePushIOSNotificationServiceExtension';

export const withNotificarePushIOS: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  config = withNotificarePushIOSCapabilities(config, props);
  config = withNotificarePushIOSEnvironment(config, props);
  config = withNotificarePushIOSNotificationServiceExtension(config, props);

  return config;
};
