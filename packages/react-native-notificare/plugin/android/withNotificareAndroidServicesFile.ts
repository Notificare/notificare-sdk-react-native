import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import path from 'path';

import { copyResources } from '../utils/utils';
import type { NotificarePluginProps } from '../types/types';

const withSetNotificareServicesFile: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  const servicesFilePath = props?.android?.servicesFile;

  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      if (!servicesFilePath) {
        throw new Error(
          'notificare-services.json file path is missing. Make sure to set android.servicesFile in react-native-notificare plugin.'
        );
      }

      const sourcePath = path.resolve(
        newConfig.modRequest.projectRoot,
        servicesFilePath
      );

      const destinationPatch = path.resolve(
        newConfig.modRequest.projectRoot,
        './android/app/notificare-services.json'
      );

      copyResources(sourcePath, destinationPatch);

      return newConfig;
    },
  ]);
};

export const withNotificareAndroidServiceFile: ConfigPlugin<
  NotificarePluginProps
> = (config, props) => {
  config = withSetNotificareServicesFile(config, props);

  return config;
};
