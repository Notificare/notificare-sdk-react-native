package re.notifica.push.react_native

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import re.notifica.push.NotificarePush

class NotificarePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
  ActivityEventListener {

  override fun getName(): String = "NotificarePushModule"

  override fun initialize() {
    super.initialize()

    NotificarePushModuleEventManager.setup(reactApplicationContext)
    NotificarePush.intentReceiver = NotificarePushModuleReceiver::class.java

    // Listen to incoming intents.
    reactApplicationContext.addActivityEventListener(this)

    val intent = reactApplicationContext.currentActivity?.intent
    if (intent != null) onNewIntent(intent)
  }

  // region ActivityEventListener

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {}

  override fun onNewIntent(intent: Intent) {
    NotificarePush.handleTrampolineIntent(intent)
  }

  // endregion

  @ReactMethod
  fun isRemoteNotificationsEnabled(promise: Promise) {
    promise.resolve(NotificarePush.isRemoteNotificationsEnabled)
  }

  @ReactMethod
  fun isAllowedUI(promise: Promise) {
    promise.resolve(NotificarePush.allowedUI)
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
