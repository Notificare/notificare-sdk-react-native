import fs from 'fs';
import path from 'path';

import { NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION } from '../../constants/constantsIOS';
import { getConfigReferences } from '../utils/xcode-project';
import { copyResources } from 'react-native-notificare/lib/plugin';

export async function setupNotificationServiceExtension(
  proj: any,
  projRoot: string,
  appBundleID?: string,
  deploymentTarget?: string
) {
  const extFiles = [
    'NotificationService.swift',
    'NotificationServiceExtension-Info.plist',
  ];

  const pluginDir = require.resolve(
    'react-native-notificare-push/package.json'
  );

  const extFilesDir = path.join(
    pluginDir,
    `../lib/plugin/ios/${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}/`
  );

  const isExtExists = fs.existsSync(
    `${projRoot}/ios/${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}`
  );
  const isTargetExists = proj.pbxTargetByName(
    NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION
  );

  try {
    if (!isExtExists) {
      copyResources(
        extFilesDir,
        `${projRoot}/ios/${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}`
      );
    }

    if (!isTargetExists) {
      const extTarget = proj.addTarget(
        NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION,
        'app_extension'
      );

      const extGroup = proj.addPbxGroup(
        extFiles,
        NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION,
        NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION
      );

      const groups = proj.hash.project.objects.PBXGroup;

      // Making files visible in Xcode
      Object.keys(groups).forEach(function (key) {
        if (groups[key].name === undefined) {
          proj.addToPbxGroup(extGroup.uuid, key);
        }
      });

      proj.addBuildPhase(
        ['NotificationService.swift'],
        'PBXSourcesBuildPhase',
        'Sources',
        extTarget.uuid
      );

      proj.addBuildPhase(
        [],
        'PBXResourcesBuildPhase',
        'Resources',
        extTarget.uuid
      );
    }

    const extConfigRefs = getConfigReferences(
      proj,
      NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION
    );

    initialSetup(
      proj,
      extConfigRefs,
      NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION,
      appBundleID
    );

    updateDeploymentTarget(proj, extConfigRefs, deploymentTarget);

    console.log(
      `Successfully ${
        !isExtExists ? 'added' : 'updated'
      } Notification Service Extension.`
    );

    return proj;
  } catch (e) {
    console.error(
      `Failed to ${
        !isExtExists ? 'add' : 'update'
      } Notification Service Extension: ${e}`
    );
  }
}

function initialSetup(
  proj: any,
  extConfigRefs: string[],
  extName: string,
  appBundleID?: string
) {
  extConfigRefs.forEach((ref) => {
    const buildSettings =
      proj.hash.project.objects.XCBuildConfiguration[ref].buildSettings;

    if (appBundleID) {
      buildSettings.PRODUCT_BUNDLE_IDENTIFIER = `${appBundleID}.NotificationServiceExtension`;
    }

    buildSettings.PRODUCT_NAME = `${extName}`;
    buildSettings.SWIFT_VERSION = '5.0';
  });
}

function updateDeploymentTarget(
  proj: any,
  extConfigRefs: string[],
  deploymentTarget?: string
) {
  extConfigRefs.forEach((ref) => {
    const buildSettings =
      proj.hash.project.objects.XCBuildConfiguration[ref].buildSettings;

    buildSettings.IPHONEOS_DEPLOYMENT_TARGET = deploymentTarget || '13.4';
  });
}
