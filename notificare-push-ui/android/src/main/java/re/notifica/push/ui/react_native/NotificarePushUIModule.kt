package re.notifica.push.ui.react_native

import android.net.Uri
import com.facebook.react.bridge.*
import re.notifica.NotificareLogger
import re.notifica.models.NotificareNotification
import re.notifica.push.ui.NotificarePushUI

class NotificarePushUIModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
  NotificarePushUI.NotificationLifecycleListener {

  override fun getName(): String = "NotificarePushUIModule"

  override fun initialize() {
    super.initialize()

    NotificarePushUIModuleEventManager.setup(reactApplicationContext)
    NotificarePushUI.addLifecycleListener(this)
  }

  override fun invalidate() {
    super.invalidate()

    NotificarePushUI.removeLifecycleListener(this)
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

  // region NotificarePushUI.NotificationLifecycleListener

  override fun onNotificationWillPresent(notification: NotificareNotification) {
    try {
      NotificarePushUIModuleEventManager.dispatchEvent("notification_will_present", notification.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_will_present event.", e)
    }
  }

  override fun onNotificationPresented(notification: NotificareNotification) {
    try {
      NotificarePushUIModuleEventManager.dispatchEvent("notification_presented", notification.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_presented event.", e)
    }
  }

  override fun onNotificationFinishedPresenting(notification: NotificareNotification) {
    try {
      NotificarePushUIModuleEventManager.dispatchEvent(
        "notification_finished_presenting",
        notification.toJson().toReactMap()
      )
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_finished_presenting event.", e)
    }
  }

  override fun onNotificationFailedToPresent(notification: NotificareNotification) {
    try {
      NotificarePushUIModuleEventManager.dispatchEvent(
        "notification_failed_to_present",
        notification.toJson().toReactMap()
      )
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_failed_to_present event.", e)
    }
  }

  override fun onNotificationUrlClicked(notification: NotificareNotification, uri: Uri) {
    try {
      val arguments = Arguments.createMap()
      arguments.putMap("notification", notification.toJson().toReactMap())
      arguments.putString("url", uri.toString())

      NotificarePushUIModuleEventManager.dispatchEvent("notification_url_clicked", arguments)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_url_clicked event.", e)
    }
  }

  override fun onActionWillExecute(notification: NotificareNotification, action: NotificareNotification.Action) {
    try {
      val arguments = Arguments.createMap()
      arguments.putMap("notification", notification.toJson().toReactMap())
      arguments.putMap("action", action.toJson().toReactMap())

      NotificarePushUIModuleEventManager.dispatchEvent("action_will_execute", arguments)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the action_will_execute event.", e)
    }
  }

  override fun onActionExecuted(notification: NotificareNotification, action: NotificareNotification.Action) {
    try {
      val arguments = Arguments.createMap()
      arguments.putMap("notification", notification.toJson().toReactMap())
      arguments.putMap("action", action.toJson().toReactMap())

      NotificarePushUIModuleEventManager.dispatchEvent("action_executed", arguments)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the action_executed event.", e)
    }
  }

  override fun onActionFailedToExecute(
    notification: NotificareNotification,
    action: NotificareNotification.Action,
    error: Exception?
  ) {
    try {
      val arguments = Arguments.createMap()
      arguments.putMap("notification", notification.toJson().toReactMap())
      arguments.putMap("action", action.toJson().toReactMap())
      if (error != null) arguments.putString("error", error.localizedMessage)

      NotificarePushUIModuleEventManager.dispatchEvent("action_failed_to_execute", arguments)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the action_failed_to_execute event.", e)
    }
  }

  override fun onCustomActionReceived(uri: Uri) {
    try {
      NotificarePushUIModuleEventManager.dispatchEvent("custom_action_received", uri.toString())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the custom_action_received event.", e)
    }
  }

  // endregion

  companion object {
    internal val DEFAULT_ERROR_CODE = "notificare_error"
  }
}
