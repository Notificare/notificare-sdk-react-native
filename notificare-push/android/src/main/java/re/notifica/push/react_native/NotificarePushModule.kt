package re.notifica.push.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import re.notifica.push.NotificarePush

class NotificarePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "NotificarePushModule"

  override fun initialize() {
    super.initialize()

    NotificarePushModuleEventManager.setup(reactApplicationContext)
    NotificarePush.intentReceiver = NotificarePushModuleReceiver::class.java
  }

  @ReactMethod
  fun isRemoteNotificationsEnabled(promise: Promise) {
    promise.resolve(NotificarePush.isRemoteNotificationsEnabled)
  }

  @ReactMethod
  fun enableRemoteNotifications(promise: Promise) {
    NotificarePush.enableRemoteNotifications()
    promise.resolve(null)
  }

  @ReactMethod
  fun disableRemoteNotifications(promise: Promise) {
    NotificarePush.disableRemoteNotifications()
    promise.resolve(null)
  }
}
