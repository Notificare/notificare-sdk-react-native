import { withNotificareAndroid } from './android/withNotificareAndroid';
import { withNotificareIOS } from './ios/withNotificareIOS';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { NotificarePluginProps } from './types/types';

const withNotificare: ConfigPlugin<NotificarePluginProps> = (config, props) => {
  config = withNotificareAndroid(config, props);
  config = withNotificareIOS(config, props);

  return config;
};

export default withNotificare;
