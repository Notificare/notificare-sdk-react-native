import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import { NotificarePushPluginProps } from '../types/types';
import {
  parseXMLAsync,
  writeXMLAsync,
} from '@expo/config-plugins/build/utils/XML';
import { resolve } from 'path';
import {
  NotificareMetaDataOption,
  processManifestMetaDataOptions,
  RESOURCE_ROOT_PATH,
} from 'react-native-notificare/lib/plugin';

const NOTIFICATION_SCHEMES_RESOURCE = 'notificare_notification_url_schemes';

const withURLSchemes: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  const schemes = props?.android?.urlSchemes;

  if (!schemes) {
    return config;
  }

  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      await createURLSchemesResource(schemes, newConfig.modRequest.projectRoot);

      return newConfig;
    },
  ]);
};

const withURLSchemesMetaData: ConfigPlugin<NotificarePushPluginProps> = (
  config,
  props
) => {
  const metaDataOptions: NotificareMetaDataOption[] = [
    {
      enabled: !!props?.android?.urlSchemes,
      metaData: {
        $: {
          'android:name': 're.notifica.push.ui.notification_url_schemes',
          'android:resource': `@array/${NOTIFICATION_SCHEMES_RESOURCE}`,
        },
      },
    },
  ];

  return processManifestMetaDataOptions(config, metaDataOptions);
};

async function createURLSchemesResource(
  schemes: string[],
  projectRoot: string
) {
  const xml = await parseXMLAsync(`
  <resources>
    <string-array name="${NOTIFICATION_SCHEMES_RESOURCE}">
      ${schemes.map((scheme) => `\n<item>${scheme}</item>`).join('')}
    </string-array>
  </resources>
  `);

  const path = resolve(
    projectRoot,
    RESOURCE_ROOT_PATH + '/values',
    NOTIFICATION_SCHEMES_RESOURCE + '.xml'
  );

  await writeXMLAsync({ path, xml });
}

export const withNotificarePushAndroidURLSchemes: ConfigPlugin<
  NotificarePushPluginProps
> = (config, props) => {
  config = withURLSchemes(config, props);
  config = withURLSchemesMetaData(config, props);

  return config;
};
