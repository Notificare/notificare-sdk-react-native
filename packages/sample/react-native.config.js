const path = require('path');

const packages = [
  'react-native-notificare',
  'react-native-notificare-assets',
  'react-native-notificare-geo',
  'react-native-notificare-in-app-messaging',
  'react-native-notificare-inbox',
  'react-native-notificare-loyalty',
  'react-native-notificare-monetize',
  'react-native-notificare-push',
  'react-native-notificare-push-ui',
  'react-native-notificare-scannables',
];

const dependencies = packages.reduce((deps, packageName) => {
  deps[packageName] = {
    root: path.join(__dirname, '..', packageName),
  };
  return deps;
}, {});

module.exports = {
  dependencies,
};
