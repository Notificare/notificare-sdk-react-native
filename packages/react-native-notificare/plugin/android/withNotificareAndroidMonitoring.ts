import { ConfigPlugin } from 'expo/config-plugins';
import { NotificarePluginProps } from '../types/types';
import {
  NotificareMetaDataOption,
  processManifestMetaDataOptions,
} from '../utils/android/manifest';

const withMetaDataOptions: ConfigPlugin<NotificarePluginProps> = (
  config,
  props
) => {
  const metaDataOptions: NotificareMetaDataOption[] = [
    {
      enabled: props?.android?.debugLoggingEnabled,
      metaData: {
        $: {
          'android:name': 're.notifica.debug_logging_enabled',
          'android:value': 'true',
        },
      },
    },
    {
      enabled: props?.android?.crashReportingEnabled === false,
      metaData: {
        $: {
          'android:name': 're.notifica.crash_reports_enabled',
          'android:value': 'false',
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

export const withNotificareAndroidMonitoring: ConfigPlugin<
  NotificarePluginProps
> = (config, props) => {
  config = withMetaDataOptions(config, props);

  return config;
};
