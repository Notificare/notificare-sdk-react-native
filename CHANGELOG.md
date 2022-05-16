# CHANGELOG

## 3.1.0

- Include complete remote message information in unknown notification events
- Add `onUnknownNotificationOpened` and `onUnknownNotificationActionOpened` events

#### Native changes

##### Android

- Include `Accept-Language` and custom `User-Agent` headers
- Allow notification push services to be subclassed
- Add notification attributes to unknown notifications
- Improve `allowedUI` to accurately reflect push capabilities
- Prevent push tokens from being registered immediately after an install

##### iOS

- Include `Accept-Language` and custom `User-Agent` headers
- Improve `allowedUI` to accurately reflect push capabilities
- Rename internal `AnyCodable` to prevent collisions
- Expose unknown notification open events via `notificare(_:didOpenUnknownNotification:)` and `notificare(_:didOpenUnknownAction:for:responseText:)`
- Launch each peer module sequentially to prevent race conditions

## 3.0.1

#### Native changes

##### Android

- Update Gradle build tools
- Use compile-time constant for the SDK version
- Remove unnecessary `BuildConfig` files
- Update dependencies

##### iOS

- Prevent multiple push registration events
- Prevent Apple-processed builds from modifying the SDK version

## 3.0.0

Please check our [migration guide](./MIGRATION.md) before adopting the v3.x generation.
