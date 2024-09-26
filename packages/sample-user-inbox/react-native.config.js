const path = require('path');

const packages = [
  'react-native-notificare',
  'react-native-notificare-push',
  'react-native-notificare-push-ui',
  'react-native-notificare-user-inbox',
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
