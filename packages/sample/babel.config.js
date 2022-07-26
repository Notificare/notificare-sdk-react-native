const path = require('path');

// Aliased packages
const packages = [
  'react-native-notificare',
  'react-native-notificare-assets',
  'react-native-notificare-authentication',
  'react-native-notificare-geo',
  'react-native-notificare-inbox',
  'react-native-notificare-loyalty',
  'react-native-notificare-monetize',
  'react-native-notificare-push',
  'react-native-notificare-push-ui',
  'react-native-notificare-scannables',
].map((name) => require(path.resolve(__dirname, '..', name, 'package.json')));

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: packages.reduce((acc, p) => {
          acc[p.name] = path.join(__dirname, '..', p.name, p.source);
          return acc;
        }, {}),
      },
    ],
  ],
};
