package re.notifica.push.ui.react_native

import com.facebook.react.bridge.*
import re.notifica.models.NotificareNotification
import re.notifica.push.ui.NotificarePushUI

class NotificarePushUIModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "NotificarePushUIModule"

  override fun initialize() {
    super.initialize()

    NotificarePushModuleEventManager.setup(reactApplicationContext)
    // NotificarePushUI.intentReceiver = NotificarePushUIModuleReceiver::class.java
  }

  @ReactMethod
  fun presentNotification(data: ReadableMap, promise: Promise) {
    val notification: NotificareNotification

    try {
      notification = NotificareNotification.fromJson(data.toJson())
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
      return
    }

    val activity = currentActivity ?: run {
      promise.reject(DEFAULT_ERROR_CODE, "Cannot present a notification without an activity.")
      return
    }

    NotificarePushUI.presentNotification(activity, notification)
    promise.resolve(null)
  }

  @ReactMethod
  fun presentAction(notificationData: ReadableMap, actionData: ReadableMap, promise: Promise) {
    val notification: NotificareNotification
    val action: NotificareNotification.Action

    try {
      notification = NotificareNotification.fromJson(notificationData.toJson())
      action = NotificareNotification.Action.fromJson(actionData.toJson())
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
      return
    }

    val activity = currentActivity ?: run {
      promise.reject(DEFAULT_ERROR_CODE, "Cannot present a notification action without an activity.")
      return
    }

    NotificarePushUI.presentAction(activity, notification, action)
    promise.resolve(null)
  }

  companion object {
    internal val DEFAULT_ERROR_CODE = "notificare_error"
  }
}
