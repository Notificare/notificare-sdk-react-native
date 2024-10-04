/* eslint-disable @typescript-eslint/no-unused-vars */

import { ProjectFile } from '@expo/config-plugins/build/android/Paths';
import {
  ConfigPlugin,
  withProjectBuildGradle,
  withAppBuildGradle,
  ExportedConfigWithProps,
} from 'expo/config-plugins';

import { NotificarePluginProps } from '../types/types';
import { replace, replaceAll } from '../utils/utils';

const NOTIFICARE_SERVICES_GRADLE_PLUGIN =
  're.notifica.gradle.notificare-services';

const withProjectGradleRepositories: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  return withProjectBuildGradle(config, (newConfig) => {
    if (!isGroovy(newConfig)) {
      console.warn(
        'Unable to add Notificare repositories to project, build.gradle is not groovy.'
      );

      return newConfig;
    }

    if (
      newConfig.modResults.contents.includes(
        'https://maven.notifica.re/releases'
      )
    ) {
      return newConfig;
    }

    try {
      newConfig.modResults.contents = replaceAll(
        newConfig.modResults.contents,
        'mavenCentral()',
        `mavenCentral()
        maven { url 'https://maven.notifica.re/releases' }
        maven { url 'https://developer.huawei.com/repo' }`
      );
    } catch (e) {
      console.warn(`Failed to add Notificare repositories to project: ${e}`);
    }

    return newConfig;
  });
};

const withProjectGradleDependencies: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  return withProjectBuildGradle(config, (newConfig) => {
    if (!isGroovy(newConfig)) {
      console.warn(
        'Unable to add Notificare dependency to project, build.gradle is not groovy.'
      );

      return newConfig;
    }

    if (
      newConfig.modResults.contents.includes(
        're.notifica.gradle:notificare-services'
      )
    ) {
      return newConfig;
    }

    newConfig.modResults.contents = replace(
      newConfig.modResults.contents,
      /dependencies\s?{/,
      `dependencies {
        classpath 're.notifica.gradle:notificare-services:1.1.0'`
    );

    return newConfig;
  });
};

const withAppGradlePlugin: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  return withAppBuildGradle(config, (newConfig) => {
    if (!isGroovy(newConfig)) {
      console.warn(
        'Unable to apply Notificare plugin, app build.gradle is not groovy.'
      );

      return newConfig;
    }

    if (
      newConfig.modResults.contents.includes(NOTIFICARE_SERVICES_GRADLE_PLUGIN)
    ) {
      return newConfig;
    }

    newConfig.modResults.contents = `${newConfig.modResults.contents}\napply plugin: '${NOTIFICARE_SERVICES_GRADLE_PLUGIN}'`;

    return newConfig;
  });
};

const isGroovy: (
  gradle: ExportedConfigWithProps<ProjectFile<'groovy' | 'kt'>>
) => boolean = (gradle) => {
  return gradle.modResults.language === 'groovy';
};

export const withNotificareAndroidGradle: ConfigPlugin<
  NotificarePluginProps
> = (config, props) => {
  config = withProjectGradleRepositories(config, props);
  config = withProjectGradleDependencies(config, props);
  config = withAppGradlePlugin(config, props);

  return config;
};
