import type { ConfigPlugin } from 'expo/config-plugins';
import { NotificareScannablesPluginProps } from './types/types';
import { withNotificareScannablesAndroid } from './android/withNotificareScannablesAndroid';

const withNotificareScannables: ConfigPlugin<
  NotificareScannablesPluginProps
> = (config, props) => {
  config = withNotificareScannablesAndroid(config, props);

  return config;
};

export default withNotificareScannables;
