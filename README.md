[<img src="https://raw.githubusercontent.com/notificare/notificare-sdk-react-native/main/assets/logo.png"/>](https://notificare.com)

# Notificare React Native SDK

[![GitHub release](https://img.shields.io/github/v/release/notificare/notificare-sdk-react-native?include_prereleases)](https://github.com/notificare/notificare-sdk-react-native/releases)
[![License](https://img.shields.io/github/license/notificare/notificare-sdk-react-native)](https://github.com/notificare/notificare-sdk-react-native/blob/main/LICENSE)

The Notificare React Native SDK makes it quick and easy to communicate efficiently with many of the Notificare API services and enables you to seamlessly integrate our various features, from Push Notifications to Contextualised Storage.

Get started with our [📚 integration guides](https://docs.notifica.re/sdk/v3/react-native/setup) and [example projects](#examples), or [📘 browse the SDK reference]() (coming soon).


> :warning: **The v3 SDK is currently in alpha. If you are running a production application, take a look at the v2.x SDK instead.**


Table of contents
=================

* [Features](#features)
* [Releases](#releases)
* [Installation](#installation)
  * [Requirements](#requirements)
  * [Configuration](#configuration)
* [Getting Started](#getting-started)
* [Examples](#examples)


## Features

**Push notifications**: Use the SDK to receive push notifications and automatically track its engagement.

**Push notifications UI**: We provide native screens and elements to display your push notifications and handle its actions with zero effort.

**Inbox**: Apps with a built-in message inbox enjoy higher conversions due to its nature of keeping messages around that can be opened as many times as users want. The SDK gives you all the tools necessary to build your inbox UI.

**Geo-location**
> coming soon

**Loyalty**
> coming soon

**Monetise**
> coming soon

**Assets**
> coming soon

**Scannables**
> coming soon


## Installation

### Requirements

* Android 6 (API level 23) and above
* iOS 10 and above

### Configuration

Add the packages to your `package.json` and follow the Getting Started guide.

```bash
# Required
yarn add react-native-notificare

# Optional modules
yarn add react-native-notificare-inbox
yarn add react-native-notificare-push
yarn add react-native-notificare-push-ui
```

## Getting Started

### Integration
Get started with our [📚 integration guides](https://docs.notifica.re/sdk/v3/react-native/setup) and [example projects](#examples), or [📘 browse the SDK reference]() (coming soon).


### Examples
- The [Demo app example project](https://github.com/Notificare/notificare-demo-react-native) demonstrates how to integrate and use our various modules in a single app.
- The example projects demonstrate more specific integrations in a simplified fashion, to quickly understand how a given feature should be implemented.
    - [Core module](https://github.com/Notificare/notificare-sdk-react-native/tree/main/notificare/example)
    - [Inbox module](https://github.com/Notificare/notificare-sdk-react-native/tree/main/notificare-inbox/example)
    - [Push module](https://github.com/Notificare/notificare-sdk-react-native/tree/main/notificare-push/example)
    - [Push UI module](https://github.com/Notificare/notificare-sdk-react-native/tree/main/notificare-push-ui/example)
