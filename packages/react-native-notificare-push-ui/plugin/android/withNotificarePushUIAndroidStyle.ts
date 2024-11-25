/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  getMainApplication,
  ManifestActivity,
} from '@expo/config-plugins/build/android/Manifest';
import {
  ResourceGroupXML,
  ResourceItemXML,
} from '@expo/config-plugins/build/android/Resources';
import {
  ConfigPlugin,
  withAndroidManifest,
  withAndroidStyles,
} from 'expo/config-plugins';

import { NotificarePushUIPluginProps } from '../types/types';

const TRANSLUCENT_STYLE_THEME = 'Theme.Notificare.PushUI.Translucent';
const PUSH_UI_ACTIVITY = 're.notifica.push.ui.NotificationActivity';

const withApplyCustomStyle: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (newConfig) => {
    if (!props?.android?.customStyle) return newConfig;

    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    const notificationActivity: ManifestActivity = {
      $: {
        'android:name': PUSH_UI_ACTIVITY,
        'android:theme': `@style/${props.android.customStyle}`,
      },
    };

    const activities = application.activity;

    if (!activities) {
      application.activity = [notificationActivity];
      return newConfig;
    }

    if (
      !activities.find(
        (activity) =>
          activity.$['android:name'] === notificationActivity.$['android:name']
      )
    ) {
      activities.push(notificationActivity);
    }

    return newConfig;
  });
};

const withCreateTranslucentStyle: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  return withAndroidStyles(config, (newConfig) => {
    const styles = newConfig.modResults.resources.style;

    const itemWindowTranslucent: ResourceItemXML = {
      _: 'true',
      $: {
        name: 'android:windowIsTranslucent',
      },
    };

    const itemWindowBackground: ResourceItemXML = {
      _: '@android:color/transparent',
      $: {
        name: 'android:windowBackground',
      },
    };

    const windowLightStatusBar: ResourceItemXML = {
      _: '?attr/isLightTheme',
      $: {
        name: 'android:windowLightStatusBar',
      },
    };

    const statusBarColor: ResourceItemXML = {
      _: '@android:color/transparent',
      $: {
        name: 'android:statusBarColor',
      },
    };

    const newStyle: ResourceGroupXML = {
      $: {
        name: TRANSLUCENT_STYLE_THEME,
        parent: 'Theme.AppCompat.DayNight',
      },
      item: [
        itemWindowTranslucent,
        itemWindowBackground,
        windowLightStatusBar,
        statusBarColor,
      ],
    };

    if (!styles) {
      newConfig.modResults.resources.style = [newStyle];
      return newConfig;
    }

    if (!styles.find((style) => style.$.name === TRANSLUCENT_STYLE_THEME)) {
      styles.push(newStyle);
    }

    return newConfig;
  });
};

const withApplyTranslucentStyle: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (newConfig) => {
    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    const notificationActivity: ManifestActivity = {
      $: {
        'android:name': PUSH_UI_ACTIVITY,
        'android:theme': `@style/${TRANSLUCENT_STYLE_THEME}`,
      },
    };

    const activities = application.activity;

    if (!activities) {
      application.activity = [notificationActivity];
      return newConfig;
    }

    if (
      !activities.find(
        (activity) =>
          activity.$['android:name'] === notificationActivity.$['android:name']
      )
    ) {
      activities.push(notificationActivity);
    }

    return newConfig;
  });
};

const withRemoveStyle: ConfigPlugin<NotificarePushUIPluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (newConfig) => {
    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    const activities = application.activity;

    if (!activities) {
      return newConfig;
    }

    application.activity = activities.filter(
      (activity) => activity.$['android:name'] !== PUSH_UI_ACTIVITY
    );

    return newConfig;
  });
};

export const withNotificarePushUIAndroidStyle: ConfigPlugin<
  NotificarePushUIPluginProps
> = (config, props) => {
  if (props?.android?.customStyle) {
    config = withApplyCustomStyle(config, props);

    return config;
  }

  if (props?.android?.useTranslucentStyle !== false) {
    config = withCreateTranslucentStyle(config, props);
    config = withApplyTranslucentStyle(config, props);

    return config;
  }

  config = withRemoveStyle(config, props);

  return config;
};
