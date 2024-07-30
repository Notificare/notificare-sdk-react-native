import type { ConfigPlugin } from 'expo/config-plugins';
import type { NotificarePushUIPluginProps } from './types/types';
import { withNotificarePushUIAndroid } from './android/withNotificarePushUIAndroid';
import { withNotificarePushUIIOS } from './ios/withNotificarePushUIIOS';

const withNotificarePushUI: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  config = withNotificarePushUIAndroid(config, props);
  config = withNotificarePushUIIOS(config, props);

  return config;
};

export default withNotificarePushUI;
