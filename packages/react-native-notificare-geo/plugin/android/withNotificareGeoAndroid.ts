import { generateImageAsync } from '@expo/image-utils';
import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { NotificareGeoPluginProps } from '../types/types';
import {
  NotificareManifestIntentFilter,
  NotificareMetaDataOption,
  processIntentFilter,
  processManifestMetaDataOptions,
  RESOURCE_ROOT_PATH,
  SMALL_ICON_FORMATS,
} from 'react-native-notificare/lib/plugin';

const BEACONS_FOREGROUND_SERVICE_ICON_NAME =
  'notificare_beacon_notification_icon';

const withForegroundServiceNotificationIcon: ConfigPlugin<
  NotificareGeoPluginProps
> = (config, props) => {
  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      if (props?.android?.beaconForegroundServiceSmallIcon) {
        await createForegroundServiceSmallIcon(
          props.android.beaconForegroundServiceSmallIcon,
          newConfig.modRequest.projectRoot
        );
      }

      return newConfig;
    },
  ]);
};

const withGeoMetaData: ConfigPlugin<NotificareGeoPluginProps> = (
  config,
  props
) => {
  const metaDataOptions: NotificareMetaDataOption[] = [
    {
      enabled: !!props?.android?.monitoredRegionsLimit,
      metaData: {
        $: {
          'android:name': 're.notifica.geo.monitored_regions_limit',
          'android:value': `${props?.android?.monitoredRegionsLimit ?? 10}`,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceEnabled,
      metaData: {
        $: {
          'android:name': 're.notifica.geo.beacons.foreground_service_enabled',
          'android:value': 'true',
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceSmallIcon,
      metaData: {
        $: {
          'android:name':
            're.notifica.geo.beacons.service_notification_small_icon',
          'android:resource': `@drawable/${BEACONS_FOREGROUND_SERVICE_ICON_NAME}`,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceTitle,
      metaData: {
        $: {
          'android:name':
            're.notifica.geo.beacons.service_notification_content_title',
          'android:value': props?.android?.beaconForegroundServiceTitle,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceMessage,
      metaData: {
        $: {
          'android:name':
            're.notifica.geo.beacons.service_notification_content_text',
          'android:value': props?.android?.beaconForegroundServiceMessage,
        },
      },
    },
    {
      enabled: !!props?.android?.beaconForegroundServiceShowProgress,
      metaData: {
        $: {
          'android:name':
            're.notifica.geo.beacons.service_notification_progress',
          'android:value': 'true',
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

const withBeaconForegroundServiceIntent: ConfigPlugin<
  NotificareGeoPluginProps
> = (config, props) => {
  const intent: NotificareManifestIntentFilter = {
    enabled: !!props?.android?.beaconForegroundServiceEnabled,
    intentFilter: {
      action: [
        {
          $: {
            'android:name':
              're.notifica.intent.action.BeaconNotificationOpened',
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

async function createForegroundServiceSmallIcon(
  icon: string,
  projectRoot: string
) {
  for (const formatType in SMALL_ICON_FORMATS) {
    const path = resolve(projectRoot, RESOURCE_ROOT_PATH, formatType);

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const resizedIcon = (
      await generateImageAsync(
        { projectRoot, cacheType: 'notificare-beacon-notification-icon' },
        {
          src: icon,
          width: SMALL_ICON_FORMATS[formatType],
          height: SMALL_ICON_FORMATS[formatType],
          resizeMode: 'cover',
          backgroundColor: 'transparent',
        }
      )
    ).source;

    const resizedIconDest = resolve(
      path,
      BEACONS_FOREGROUND_SERVICE_ICON_NAME + '.png'
    );
    writeFileSync(resizedIconDest, resizedIcon);
  }
}

export const withNotificareGeoAndroid: ConfigPlugin<
  NotificareGeoPluginProps
> = (config, props) => {
  config = withForegroundServiceNotificationIcon(config, props);
  config = withGeoMetaData(config, props);
  config = withBeaconForegroundServiceIntent(config, props);

  return config;
};
