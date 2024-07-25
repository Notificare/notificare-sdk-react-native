/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePushPluginProps } from '../types/types';
import {
  NotificareManifestIntentFilter,
  processIntentFilter,
} from 'react-native-notificare/lib/plugin';

const withRemoteMessageTrampoline: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  const intent: NotificareManifestIntentFilter = {
    enabled: true,
    intentFilter: {
      action: [
        {
          $: {
            'android:name': 're.notifica.intent.action.RemoteMessageOpened',
          },
        },
      ],
      category: [
        {
          $: {
            'android:name': 'android.intent.category.DEFAULT',
          },
        },
      ],
    },
  };

  return processIntentFilter(config, intent);
};

export const withNotificarePushAndroidManifest: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withRemoteMessageTrampoline(config, props);

  return config;
};
