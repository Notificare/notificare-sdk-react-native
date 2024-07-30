import { ConfigPlugin, withEntitlementsPlist } from 'expo/config-plugins';

import { NotificarePushPluginProps } from '../types/types';

const withAPNSEnvironment: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  return withEntitlementsPlist(config, (plist) => {
    if (props?.ios?.mode) {
      plist.modResults['aps-environment'] = props.ios.mode;
    } else {
      throw new Error(
        'Property "mode" is not set in "react-native-notificare-push" plugin.'
      );
    }

    return plist;
  });
};

export const withNotificarePushIOSEnvironment: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withAPNSEnvironment(config, props);

  return config;
};
