/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

import { NotificarePushPluginProps } from '../types/types';

const withBackgroundModes: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  return withInfoPlist(config, (plist) => {
    if (!Array.isArray(plist.modResults.UIBackgroundModes)) {
      plist.modResults.UIBackgroundModes = [];
    }

    if (!plist.modResults.UIBackgroundModes.includes('remote-notification')) {
      plist.modResults.UIBackgroundModes.push('remote-notification');
    }

    return plist;
  });
};

export const withNotificarePushIOSCapabilities: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withBackgroundModes(config, props);

  return config;
};
