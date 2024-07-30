import { withNotificareIOSFiles } from './withNotificareIOSFiles';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { NotificarePluginProps } from '../types/types';

export const withNotificareIOS: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  config = withNotificareIOSFiles(config, props);

  return config;
};
