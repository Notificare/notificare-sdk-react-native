# MIGRATING

In Notificare 4.x, one of the most significant changes is the immutability of device identifiers. Previously, the `id` property of a `NotificareDevice` would change based on the device's push capability. Now, new devices will be assigned a UUID that remains constant. For existing devices, their current identifier will persist without changes.

Previously, the functions `launch()`, `unlaunch()`, `enableRemoteNotifications()`, and `disableRemoteNotifications()` would complete before their underlying processes were finished, requiring you to listen for events like `onReady()` to know when to continue. Now, the native functions are asynchronous, ensuring the entire process is completed during their execution, which allows developers to write simpler control flows.

## Breaking changes

### Device identifier immutability

As noted, device identifiers are now immutable in Notificare 4.x. Most applications won't need to directly access the device identifier or the push token, as Notificare handles these internally. However, if you do need to access the push token, it is available through the `react-native-notificare-push` module.

```javascript
// Get the current subscription.
const subscription = await NotificarePush.getSubscription();

// Observe changes to the subscription.
NotificarePush.onSubscriptionChanged((subscription) => {

})
```

### Device registration behavior

In previous versions, the `onDeviceRegistered` event triggered when enabling or disabling remote notifications. With the new immutability of device identifiers, this event will now only trigger once — when the device is initially created.

If you need to track changes when a device switches between a temporary and a push-enabled state (or vice versa), you can listen to the `onSubscriptionChanged` property, as demonstrated in the example above.

### Drop support for Huawei Mobile Services

Support for Huawei Mobile Services (HMS) has been discontinued due to limited market adoption and the absence of ongoing development from Huawei.

## Migration guides for other versions

Looking to migrate from an older version of Notificare? Refer to the following guides for more details:

- [Migrating to 3.0.0](./MIGRATION-3.0.md)

---

As always, if you have anything to add or require further assistance, we are available via our [Support Channel](mailto:support@notifica.re).
