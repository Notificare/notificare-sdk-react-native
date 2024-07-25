import fs from 'fs';
import path from 'path';

export function copyResources(srcPath: string, destPath: string) {
  const exists = fs.existsSync(srcPath);

  if (!exists) {
    return;
  }

  const isDirectory = fs.statSync(srcPath).isDirectory();

  if (exists && isDirectory) {
    fs.mkdirSync(destPath);
    fs.readdirSync(srcPath).forEach(function (fileName) {
      copyResources(
        path.join(srcPath, fileName),
        path.join(destPath, fileName)
      );
    });
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}

/**
 * @throws {Error}
 */
export function replace(
  contents: string,
  match: string | RegExp,
  replace: string
): string {
  if (typeof match === 'string' && !contents.includes(match)) {
    throw new Error('Could not find content to replace.');
  }

  if (match instanceof RegExp && !match.test(contents)) {
    throw new Error('Could not find content to replace.');
  }

  return contents.replace(match, replace);
}

/**
 * @throws {Error}
 */
export function replaceAll(
  contents: string,
  match: string | RegExp,
  replace: string
): string {
  if (typeof match === 'string' && !contents.includes(match)) {
    throw new Error('Could not find content to replace.');
  }

  if (match instanceof RegExp && !match.test(contents)) {
    throw new Error('Could not find content to replace.');
  }

  return contents.replaceAll(match, replace);
}
