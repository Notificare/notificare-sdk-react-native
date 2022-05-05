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
            EventBroker.dispatchEvent("notification_received", notification.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the notification_received event.", e)
        }
    }

    override fun onSystemNotificationReceived(context: Context, notification: NotificareSystemNotification) {
        try {
            EventBroker.dispatchEvent("system_notification_received", notification.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the system_notification_received event.", e)
        }
    }

    override fun onUnknownNotificationReceived(context: Context, notification: NotificareUnknownNotification) {
        val arguments = Arguments.createMap()

        arguments.putString("messageId", notification.messageId)
        arguments.putString("messageType", notification.messageType)
        arguments.putString("senderId", notification.senderId)
        arguments.putString("collapseKey", notification.collapseKey)
        arguments.putString("from", notification.from)
        arguments.putString("to", notification.to)
        arguments.putDouble("sentTime", notification.sentTime.toDouble())
        arguments.putDouble("ttl", notification.ttl.toDouble())
        arguments.putInt("priority", notification.priority)
        arguments.putInt("originalPriority", notification.originalPriority)
        arguments.putMap("notification", notification.notification?.let {
            Arguments.createMap().apply {
                putString("title", it.title)
                putString("titleLocalizationKey", it.titleLocalizationKey)
                putArray("titleLocalizationArgs", it.titleLocalizationArgs?.let { args -> Arguments.fromList(args) })
                putString("body", it.body)
                putString("bodyLocalizationKey", it.bodyLocalizationKey)
                putArray("bodyLocalizationArgs", it.bodyLocalizationArgs?.let { args -> Arguments.fromList(args) })
                putString("icon", it.icon)
                putString("imageUrl", it.imageUrl?.toString())
                putString("sound", it.sound)
                putString("tag", it.tag)
                putString("color", it.color)
                putString("clickAction", it.clickAction)
                putString("channelId", it.channelId)
                putString("link", it.link?.toString())
                putString("ticker", it.ticker)
                putBoolean("sticky", it.sticky)
                putBoolean("localOnly", it.localOnly)
                putBoolean("defaultSound", it.defaultSound)
                putBoolean("defaultVibrateSettings", it.defaultVibrateSettings)
                putBoolean("defaultLightSettings", it.defaultLightSettings)
                it.notificationPriority?.let { priority -> putInt("notificationPriority", priority) }
                it.visibility?.let { visibility -> putInt("visibility", visibility) }
                it.notificationCount?.let { notificationCount -> putInt("notificationCount", notificationCount) }
                it.eventTime?.let { eventTime -> putDouble("eventTime", eventTime.toDouble()) }
                putArray("lightSettings", it.lightSettings?.let { args -> Arguments.fromList(args) })
                putArray("vibrateSettings", it.vibrateSettings?.let { args -> Arguments.fromList(args) })
            }
        })
        arguments.putMap("data", Arguments.createMap().apply {
            notification.data.forEach {
                putString(it.key, it.value)
            }
        })

        EventBroker.dispatchEvent("unknown_notification_received", arguments)
    }

    override fun onNotificationOpened(context: Context, notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent("notification_opened", notification.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the notification_opened event.", e)
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

            EventBroker.dispatchEvent("notification_action_opened", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the notification_action_opened event.", e)
        }
    }
}
