import { getResolvedLocalesAsync } from '@expo/config-plugins/build/ios/Locales';
import { IOSConfig } from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

const LOCALIZABLE_FILE = 'Localizable.strings';
const LOCALIZABLES_FOLDER = 'Notificare';

export async function createAndSetStringsResource(
  proj: any,
  projRoot: string,
  appName: string,
  locales: { [p: string]: string }
): Promise<any> {
  const localesMap = await getResolvedLocalesAsync(projRoot, locales);
  const iosAppPath = IOSConfig.Paths.getSourceRoot(projRoot);
  const destinationPath = path.join(iosAppPath, LOCALIZABLES_FOLDER);

  for (const [lang, localizationObj] of Object.entries(localesMap)) {
    const localizableFolderName = lang === 'default' ? 'Base' : lang;
    const localizableGroupName = `${appName}/${LOCALIZABLES_FOLDER}/${localizableFolderName}.lproj`;
    const localizableFileContent = [];
    const localizableFolderPath = path.join(
      destinationPath,
      `${localizableFolderName}.lproj`
    );

    const localizableFilePath = path.join(
      localizableFolderPath,
      LOCALIZABLE_FILE
    );

    await fs.promises.mkdir(localizableFolderPath, { recursive: true });

    for (const [key, value] of Object.entries(localizationObj)) {
      localizableFileContent.push(`${key} = "${value}";`);
    }

    fs.writeFileSync(localizableFilePath, localizableFileContent.join('\n'));

    // Adds children to PBXGroup and creates one when doesn't exist
    // Note: created PBXGroup will have path === '""'
    IOSConfig.XcodeUtils.ensureGroupRecursively(proj, localizableGroupName);

    if (
      !groupHasChild(proj, `${localizableFolderName}.lproj`, LOCALIZABLE_FILE)
    ) {
      proj = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: path.relative(destinationPath, localizableFilePath),
        groupName: localizableGroupName,
        project: proj,
        isBuildFile: true,
        verbose: true,
      });
    }
  }

  setNotificarePBXGroupPath(proj, appName);

  return proj;
}

function setNotificarePBXGroupPath(proj: any, appName: string) {
  const groups = proj.hash.project.objects['PBXGroup'];

  Object.keys(groups).forEach(function (key) {
    if (
      groups[key]?.name === LOCALIZABLES_FOLDER &&
      groups[key]?.path === '""'
    ) {
      groups[key].path = `${appName}/${LOCALIZABLES_FOLDER}`;
    }
  });
}

function groupHasChild(proj: any, group: string, child: string): boolean {
  const groups = proj.hash.project.objects['PBXGroup'];

  return Object.keys(groups).some(function (key) {
    return (
      (groups[key]?.name === group || groups[key]?.name === `"${group}"`) &&
      // @ts-ignore
      groups[key]?.children?.some(({ comment }) => comment === child)
    );
  });
}
