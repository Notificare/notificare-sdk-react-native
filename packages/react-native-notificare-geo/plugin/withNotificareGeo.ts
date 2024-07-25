import { withNotificareGeoAndroid } from './android/withNotificareGeoAndroid';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { NotificareGeoPluginProps } from './types/types';

const withNotificareGeo: ConfigPlugin<NotificareGeoPluginProps> = (
  config,
  props
) => {
  config = withNotificareGeoAndroid(config, props);

  return config;
};

export default withNotificareGeo;
