import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'Sample Expo',
  slug: 'sample-expo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 're.notifica.sample.app.dev',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  primaryColor: '#00000000',
  androidStatusBar: {
    backgroundColor: '#00000000',
  },
  ios: {
    bundleIdentifier: 're.notifica.sample.app.dev',
    associatedDomains: [
      `applinks:${process.env.NOTIFICARE_APP_ID}.applinks.notifica.re`,
      `applinks:sample-app-dev.ntc.re`,
    ],
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription:
        "We will need access to the device's camera to reply to notifications",
      NSPhotoLibraryUsageDescription:
        'We will need access to your photos to reply to notifications',
      NSLocationWhenInUseUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
      NSLocationAlwaysUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'We will need to make use of your location to present relevant information about offers around you.',
    },
  },
  android: {
    package: 're.notifica.sample.app.dev',
    googleServicesFile: './configuration/google-services.json',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: `${process.env.NOTIFICARE_APP_ID}.applinks.notifica.re`,
            pathPrefix: '/testdevice',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'sample-app-dev.ntc.re',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    'expo-router',
    [
      'react-native-notificare',
      {
        ios: {
          servicesFile: './configuration/NotificareServices.plist',
          optionsFile: './configuration/NotificareOptions.plist',
        },
        android: {
          servicesFile: './configuration/notificare-services.json',
          debugLoggingEnabled: true,
        },
      },
    ],
    [
      'react-native-notificare-push',
      {
        ios: {
          mode: 'development',
          useNotificationServiceExtension: true,
          deploymentTarget: '15.1',
        },
        android: {
          urlSchemes: ['com.example', 'com.example2', 'com.example3'],
          notification: {
            smallIcon: './assets/notification-icon.png',
            smallIconAccentColor: '#fc0366',
          },
        },
      },
    ],
    [
      'react-native-notificare-push-ui',
      {
        ios: {
          locales: {
            default: './assets/locales/ios/default.json',
            fr: './assets/locales/ios/french.json',
          },
        },
        android: {
          locales: {
            default: './assets/locales/android/default.json',
            fr: './assets/locales/android/french.json',
          },
        },
      },
    ],
    [
      'react-native-notificare-geo',
      {
        android: {
          beaconForegroundServiceEnabled: true,
          beaconForegroundServiceSmallIcon:
            './assets/beacon-notification-icon.png',
          beaconForegroundServiceTitle: 'Beacon notification title',
          beaconForegroundServiceMessage: 'Beacon notification message',
          beaconForegroundServiceShowProgress: true,
          monitoredRegionsLimit: 20,
        },
      },
    ],
    [
      'react-native-notificare-scannables',
      {
        android: {
          customStyle: 'Theme.Notificare.PushUI.Translucent',
        },
      },
    ],
    [
      'react-native-permissions',
      {
        iosPermissions: [
          'Camera',
          'Microphone',
          'LocationWhenInUse',
          'LocationAlways',
          'Notifications',
          'Bluetooth',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
