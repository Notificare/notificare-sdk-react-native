import {
  ConfigPlugin,
  withDangerousMod,
  IOSConfig,
  withXcodeProject,
} from 'expo/config-plugins';
import path from 'path';

import type { NotificarePluginProps } from '../types/types';
import { copyResources } from '../utils/utils';

const NOTIFICARE_SERVICES_FILE = 'NotificareServices.plist';
const NOTIFICARE_OPTIONS_FILE = 'NotificareOptions.plist';

const withSetNotificareServicesFile: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  const servicesFilePath = props?.ios?.servicesFile;

  config = withDangerousMod(config, [
    'ios',
    async (newConfig) => {
      if (!servicesFilePath) {
        throw new Error(
          'NotificareServices.plist file path is missing. Make sure to set ios.servicesFile in react-native-notificare plugin.'
        );
      }

      const sourceProjectRoot = IOSConfig.Paths.getSourceRoot(
        newConfig.modRequest.projectRoot
      );

      const sourcePath = path.resolve(
        newConfig.modRequest.projectRoot,
        servicesFilePath
      );

      const destinationPath = path.resolve(
        sourceProjectRoot,
        NOTIFICARE_SERVICES_FILE
      );

      copyResources(sourcePath, destinationPath);

      return newConfig;
    },
  ]);

  config = withXcodeProject(config, (project) => {
    const groupName = IOSConfig.XcodeUtils.getHackyProjectName(
      project.modRequest.projectRoot,
      config
    );

    if (
      !groupHasChild(project.modResults, groupName, NOTIFICARE_SERVICES_FILE)
    ) {
      project.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: `${groupName}/${NOTIFICARE_SERVICES_FILE}`,
        groupName,
        project: project.modResults,
        isBuildFile: true,
        verbose: true,
      });
    }

    return project;
  });

  return config;
};

const withSetNotificareOptionsFile: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  const optionsFilePath = props?.ios?.optionsFile;

  if (!optionsFilePath) {
    return config;
  }

  config = withDangerousMod(config, [
    'ios',
    async (newConfig) => {
      const sourceProjectRoot = IOSConfig.Paths.getSourceRoot(
        newConfig.modRequest.projectRoot
      );

      const sourcePath = path.resolve(
        newConfig.modRequest.projectRoot,
        optionsFilePath
      );

      const destinationPath = path.resolve(
        sourceProjectRoot,
        NOTIFICARE_OPTIONS_FILE
      );

      copyResources(sourcePath, destinationPath);

      return newConfig;
    },
  ]);

  config = withXcodeProject(config, (project) => {
    const groupName = IOSConfig.XcodeUtils.getHackyProjectName(
      project.modRequest.projectRoot,
      config
    );

    if (
      !groupHasChild(project.modResults, groupName, NOTIFICARE_OPTIONS_FILE)
    ) {
      project.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: `${groupName}/${NOTIFICARE_OPTIONS_FILE}`,
        groupName,
        project: project.modResults,
        isBuildFile: true,
        verbose: true,
      });
    }

    return project;
  });

  return config;
};

function groupHasChild(proj: any, group: string, child: string): boolean {
  const groups = proj.hash.project.objects.PBXGroup;

  return Object.keys(groups).some(function (key) {
    return (
      groups[key]?.name === group &&
      // @ts-ignore
      groups[key]?.children?.some(({ comment }) => comment === child)
    );
  });
}

export const withNotificareIOSFiles: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  config = withSetNotificareServicesFile(config, props);
  config = withSetNotificareOptionsFile(config, props);

  return config;
};
