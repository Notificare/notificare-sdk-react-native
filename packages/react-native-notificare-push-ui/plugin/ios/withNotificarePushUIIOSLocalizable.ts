import { ConfigPlugin, IOSConfig, withXcodeProject } from 'expo/config-plugins';

import { createAndSetStringsResource } from './hooks/create-and-set-strings-resource';
import { NotificarePushUIPluginProps } from '../types/types';

const withSetupLocalizable: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  return withXcodeProject(config, async (newConfig) => {
    const locales = props?.ios?.locales;

    if (!locales) {
      return newConfig;
    }

    const project = newConfig.modResults;
    const projRoot = newConfig.modRequest.projectRoot;
    const appName = IOSConfig.XcodeUtils.getHackyProjectName(projRoot, config);

    newConfig.modResults = await createAndSetStringsResource(
      project,
      projRoot,
      appName,
      locales
    );

    return newConfig;
  });
};

export const withNotificarePushUIIOSLocalizable: ConfigPlugin<
  NotificarePushUIPluginProps
> = (config, props) => {
  config = withSetupLocalizable(config, props);

  return config;
};
