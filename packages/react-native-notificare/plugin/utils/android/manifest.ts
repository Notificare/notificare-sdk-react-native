import {
  getMainActivity,
  getMainApplication,
  ManifestIntentFilter,
  ManifestMetaData,
} from '@expo/config-plugins/build/android/Manifest';
import { ExpoConfig } from '@expo/config-types';
import { withAndroidManifest } from 'expo/config-plugins';

export type NotificareMetaDataOption = {
  enabled?: boolean;
  metaData: ManifestMetaData;
};

export type NotificareManifestIntentFilter = {
  enabled?: boolean;
  intentFilter: ManifestIntentFilter;
};

export function processManifestMetaDataOptions(
  config: ExpoConfig,
  metaDataOptions: NotificareMetaDataOption[]
): ExpoConfig {
  return withAndroidManifest(config, (newConfig) => {
    const application = getMainApplication(newConfig.modResults);

    if (!application) {
      console.warn('No ".MainApplication" found in manifest.');
      return newConfig;
    }

    let metaDataList = application['meta-data'];

    metaDataOptions.forEach((option) => {
      if (option.enabled) {
        if (!Array.isArray(metaDataList)) {
          metaDataList = [option.metaData];
        } else if (
          !metaDataList.find(
            (metaData) =>
              metaData.$['android:name'] === option.metaData.$['android:name']
          )
        ) {
          metaDataList.push(option.metaData);
        }
      } else if (Array.isArray(metaDataList)) {
        metaDataList = metaDataList.filter(
          (metaData) =>
            metaData.$['android:name'] !== option.metaData.$['android:name']
        );
      }
    });

    application['meta-data'] = metaDataList;

    return newConfig;
  });
}

export function processIntentFilter(
  config: ExpoConfig,
  intent: NotificareManifestIntentFilter
): ExpoConfig {
  return withAndroidManifest(config, (newConfig) => {
    const activity = getMainActivity(newConfig.modResults);

    if (!activity) {
      console.warn('No ".MainActivity" found in manifest.');
      return newConfig;
    }

    const filters = activity['intent-filter'];

    if (intent.enabled) {
      if (!Array.isArray(filters)) {
        activity['intent-filter'] = [intent.intentFilter];
      } else if (
        !filters.find((filter) =>
          filter.action?.some(
            (action) =>
              action.$['android:name'] ===
              intent.intentFilter.action?.[0].$['android:name']
          )
        )
      ) {
        filters.push(intent.intentFilter);
      }
    } else if (
      Array.isArray(filters) &&
      !!intent.intentFilter.action?.[0].$['android:name']
    ) {
      activity['intent-filter'] = filters.filter(
        (intentFilter) =>
          intentFilter.action?.[0].$['android:name'] !==
          intent.intentFilter.action?.[0].$['android:name']
      );
    }

    return newConfig;
  });
}
