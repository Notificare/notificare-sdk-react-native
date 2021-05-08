package re.notifica.push.react_native

import com.facebook.react.bridge.Arguments
import re.notifica.NotificareLogger
import re.notifica.models.NotificareNotification
import re.notifica.push.NotificarePushIntentReceiver
import re.notifica.push.models.NotificareSystemNotification
import re.notifica.push.models.NotificareUnknownNotification

class NotificarePushModuleReceiver : NotificarePushIntentReceiver() {

  override fun onNotificationReceived(notification: NotificareNotification) {
    try {
      NotificarePushModuleEventManager.dispatchEvent("notification_received", notification.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_received event.", e)
    }
  }

  override fun onSystemNotificationReceived(notification: NotificareSystemNotification) {
    try {
      NotificarePushModuleEventManager.dispatchEvent("system_notification_received", notification.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the system_notification_received event.", e)
    }
  }

  override fun onUnknownNotificationReceived(notification: NotificareUnknownNotification) {
    val arguments = Arguments.createMap()
    notification.data.forEach {
      arguments.putString(it.key, it.value)
    }

    NotificarePushModuleEventManager.dispatchEvent("unknown_notification_received", arguments)
  }

  override fun onNotificationOpened(notification: NotificareNotification) {
    try {
      NotificarePushModuleEventManager.dispatchEvent("notification_opened", notification.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_opened event.", e)
    }
  }

  override fun onActionOpened(notification: NotificareNotification, action: NotificareNotification.Action) {
    try {
      val arguments = Arguments.createMap()
      arguments.putMap("notification", notification.toJson().toReactMap())
      arguments.putMap("action", action.toJson().toReactMap())

      NotificarePushModuleEventManager.dispatchEvent("notification_action_opened", arguments)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the notification_action_opened event.", e)
    }
  }
}
