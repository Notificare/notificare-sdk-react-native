package re.notifica.push.react_native

import android.content.Context
import com.facebook.react.bridge.Arguments
import re.notifica.internal.NotificareLogger
import re.notifica.models.NotificareNotification
import re.notifica.push.NotificarePushIntentReceiver
import re.notifica.push.models.NotificareSystemNotification
import re.notifica.push.models.NotificareUnknownNotification

internal class NotificarePushModuleIntentReceiver : NotificarePushIntentReceiver() {
    override fun onNotificationReceived(context: Context, notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent("re.notifica.push.notification_received", notification.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_received event.", e)
        }
    }

    override fun onSystemNotificationReceived(context: Context, notification: NotificareSystemNotification) {
        try {
            EventBroker.dispatchEvent(
                "re.notifica.push.system_notification_received",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.push.system_notification_received event.", e)
        }
    }

    override fun onUnknownNotificationReceived(context: Context, notification: NotificareUnknownNotification) {
        try {
            EventBroker.dispatchEvent(
                "re.notifica.push.unknown_notification_received",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.push.unknown_notification_received event.", e)
        }
    }

    override fun onNotificationOpened(context: Context, notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent("re.notifica.push.notification_opened", notification.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_opened event.", e)
        }
    }

    override fun onActionOpened(
        context: Context,
        notification: NotificareNotification,
        action: NotificareNotification.Action
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("re.notifica.push.notification_action_opened", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_action_opened event.", e)
        }
    }
}
