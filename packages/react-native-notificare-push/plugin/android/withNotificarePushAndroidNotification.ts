import { generateImageAsync } from '@expo/image-utils';
import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidColors,
  withDangerousMod,
} from 'expo/config-plugins';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { NotificarePushPluginProps } from '../types/types';
import {
  NotificareMetaDataOption,
  processManifestMetaDataOptions,
  RESOURCE_ROOT_PATH,
  SMALL_ICON_FORMATS,
} from 'react-native-notificare/lib/plugin';

const { Colors } = AndroidConfig;

const ICON_NAME = 'notificare_notification_small_icon';
const ACCENT_COLOR_NAME = 'notificare_notification_small_icon_color';

const withNotificationSmallIcon: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      if (props?.android?.notification?.smallIcon) {
        await createNotificationSmallIcon(
          props.android.notification.smallIcon,
          newConfig.modRequest.projectRoot
        );
      }

      return newConfig;
    },
  ]);
};

const withNotificationSmallIconAccentColor: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  return withAndroidColors(config, (newConfig) => {
    // Sets or removes color based on nullish factor
    Colors.assignColorValue(newConfig.modResults, {
      name: ACCENT_COLOR_NAME,
      value: props?.android?.notification?.smallIconAccentColor ?? null,
    });

    return newConfig;
  });
};

const withNotificationOptionsMetaData: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  const metaDataOptions: NotificareMetaDataOption[] = [
    {
      enabled: !!props?.android?.notification?.smallIcon,
      metaData: {
        $: {
          'android:name': 're.notifica.push.notification_small_icon',
          'android:resource': `@drawable/${ICON_NAME}`,
        },
      },
    },
    {
      enabled: !!props?.android?.notification?.smallIconAccentColor,
      metaData: {
        $: {
          'android:name': 're.notifica.push.notification_accent_color',
          'android:resource': `@color/${ACCENT_COLOR_NAME}`,
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

async function createNotificationSmallIcon(icon: string, projectRoot: string) {
  for (const formatType in SMALL_ICON_FORMATS) {
    const path = resolve(projectRoot, RESOURCE_ROOT_PATH, formatType);

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const resizedIcon = (
      await generateImageAsync(
        { projectRoot, cacheType: 'notificare-notification-icon' },
        {
          src: icon,
          width: SMALL_ICON_FORMATS[formatType],
          height: SMALL_ICON_FORMATS[formatType],
          resizeMode: 'cover',
          backgroundColor: 'transparent',
        }
      )
    ).source;

    const resizedIconDest = resolve(path, ICON_NAME + '.png');
    writeFileSync(resizedIconDest, resizedIcon);
  }
}

export const withNotificarePushAndroidNotification: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withNotificationSmallIcon(config, props);
  config = withNotificationSmallIconAccentColor(config, props);
  config = withNotificationOptionsMetaData(config, props);

  return config;
};
