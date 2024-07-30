import { withNotificarePushAndroid } from './android/withNotificarePushAndroid';
import { withNotificarePushIOS } from './ios/withNotificarePushIOS';
import type { ConfigPlugin } from 'expo/config-plugins';
import type { NotificarePushPluginProps } from './types/types';

const withNotificarePush: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  config = withNotificarePushAndroid(config, props);
  config = withNotificarePushIOS(config, props);

  return config;
};

export default withNotificarePush;
