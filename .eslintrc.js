// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    ],
  },
  ignorePatterns: [
    'node_modules/',
    'packages/react-native-*/lib',
    'packages/sample/babel.config.js',
    'packages/sample/metro.config.js',
    'packages/sample/jest.config.js',
  ],
};
