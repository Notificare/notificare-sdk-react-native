const path = require('path');

// Aliased packages
const packages = [
  'react-native-awesome-boilerplate',
  'react-native-notificare',
  'react-native-notificare-push',
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
