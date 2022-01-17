# MIGRATING

Notificare 3.x upgrades our native implementation languages from Java to Kotlin and Objective-C to Swift, as well as providing a fully sound null-safety. This new generation also brings a highly modular system.
If you are already using null safety in your project, you should have a first class experience.

## Requirements

We have increased the minimum versions required to run the Notificare libraries to Android 6.0+ (API level 23+) and iOS 10+. According to Google's API version distribution stats, this minimum version should support ~94% of the Android devices, and, virtually, every iOS device worldwide.

## Configuration file

### Android

Instead of the `notificareconfig.properties` you are used to having in the v2.x library and that contains two sets of app keys — development and production — we have moved to a `notificare-services.json` for each environment, similar to what Firebase offers.

We have also created a Gradle plugin to help you automatically configure the Notificare libraries. Add the following to your `build.gradle` files.

```gradle
//
// root build.gradle
//
buildscript {
    repositories {
        maven { url 'https://maven.notifica.re/releases' }
    }
    dependencies {
        classpath 're.notifica.gradle:notificare-services:1.0.0'
    }
}

allprojects {
    repositories {
        maven { url 'https://maven.notifica.re/releases' }
    }
}

//
// app build.gradle
//
plugins {
    // ...
    id 're.notifica.gradle.notificare-services'
}
```

### iOS

Similar to the change in Android, the `Notificare.plist` has been removed in favour of a `NotificareServices.plist` for each environment.

We have also created a blog post that illustrates how we can use Build Phases to pick which configuration to embed in the app during the build. You can read more about it [here](https://notificare.com/blog/2021/12/17/Configuration-files-in-a-multiple-environment-app).

## Packages

We have moved to several new packages. Here's all the dependencies available:

```json
{
  "dependencies": {
    "react-native-notificare": "3.0.0-beta.1",
    "react-native-notificare-assets": "3.0.0-beta.1",
    "react-native-notificare-authentication": "3.0.0-beta.1",
    "react-native-notificare-geo": "3.0.0-beta.1",
    "react-native-notificare-inbox": "3.0.0-beta.1",
    "react-native-notificare-loyalty": "3.0.0-beta.1",
    "react-native-notificare-push": "3.0.0-beta.1",
    "react-native-notificare-push-ui": "3.0.0-beta.1",
    "react-native-notificare-scannables": "3.0.0-beta.1"
  }
}
```

## Package cherry-picking

In the v2.x iteration, we already took the first steps to a more modular library. In this iteration we took it a whole new level.

We understand that not every app will take advantage of every bit of functionality provided by our platform. To help reduce your app's size, dependency footprint and automatically included permissions, now you are able to cherry-pick which modules you want to include in your app.

In the hypothetical scenario where you have an app that wants to add push notifications and an in-app inbox, only supporting devices running Google's mobile services, you would include the following dependencies.

```json
{
  "dependencies": {
    "react-native-notificare": "3.0.0-beta.1",
    "react-native-notificare-inbox": "3.0.0-beta.1",
    "react-native-notificare-push": "3.0.0-beta.1",
    "react-native-notificare-push-ui": "3.0.0-beta.1"
  }
}
```

## Moving forward

Given the foundational changes and large differences in the Public API in the new libraries, we found the best way to cover every detail is to go through the [documentation](https://docs.notifica.re/sdk/v3/react-native/implementation) for each of the modules you want to include and adjust accordingly.

As always, if you have anything to add or require further assistance, we are available via our [Support Channel](mailto:support@notifica.re).
