import plist from '@expo/plist';
import fs from 'fs';

import { NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION } from '../../constants/constantsIOS';

export function updateNotificationServicePlist(
  projRoot: string,
  bundleVersion?: string,
  bundleShortVersion?: string
) {
  let extInfoPlist;

  const extPlistPath = `${projRoot}/ios/${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}/${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}-Info.plist`;

  try {
    extInfoPlist = plist.parse(fs.readFileSync(extPlistPath, 'utf8'));
  } catch (e) {
    console.log(
      `Failed to parse ${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}-Info.plist: ${e}`
    );
  }

  if (!extInfoPlist) {
    return;
  }

  try {
    if (bundleVersion) {
      extInfoPlist.CFBundleVersion = bundleVersion;
    }

    if (bundleShortVersion) {
      extInfoPlist.CFBundleShortVersionString = bundleShortVersion;
    }

    let info_contents = plist.build(extInfoPlist, { indent: '\t', offset: -1 });
    info_contents = info_contents.replace(
      /<string>[\s\r\n]*<\/string>/g,
      '<string></string>'
    );

    fs.writeFileSync(extPlistPath, info_contents, 'utf-8');
    console.log(
      `Successfully updated ${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}-Info.plist.`
    );
  } catch (e) {
    console.error(
      `Failed to update ${NOTIFICARE_NOTIFICATION_SERVICE_EXTENSION}-Info.plist: ${e}`
    );
  }
}
