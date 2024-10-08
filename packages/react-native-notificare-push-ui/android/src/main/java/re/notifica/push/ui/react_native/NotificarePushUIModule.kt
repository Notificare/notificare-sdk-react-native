package re.notifica.push.ui.react_native

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import re.notifica.Notificare
import re.notifica.models.NotificareNotification
import re.notifica.push.ui.NotificarePushUI
import re.notifica.push.ui.ktx.pushUI

public class NotificarePushUIModule internal constructor(context: ReactApplicationContext) :
    NotificarePushUIModuleSpec(context), NotificarePushUI.NotificationLifecycleListener {

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Notificare.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
        Notificare.pushUI().addLifecycleListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Notificare.pushUI().removeLifecycleListener(this)
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Push UI

    @ReactMethod
    override fun presentNotification(data: ReadableMap, promise: Promise) {
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

        Notificare.pushUI().presentNotification(activity, notification)
        promise.resolve(null)
    }

    @ReactMethod
    override fun presentAction(notificationData: ReadableMap, actionData: ReadableMap, promise: Promise) {
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

        Notificare.pushUI().presentAction(activity, notification, action)
        promise.resolve(null)
    }

    // endregion

    // region NotificarePushUI.NotificationLifecycleListener

    override fun onNotificationWillPresent(notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent(
                "re.notifica.push.ui.notification_will_present",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.notification_will_present event.", e)
        }
    }

    override fun onNotificationPresented(notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent("re.notifica.push.ui.notification_presented", notification.toJson().toReactMap())
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.notification_presented event.", e)
        }
    }

    override fun onNotificationFinishedPresenting(notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent(
                "re.notifica.push.ui.notification_finished_presenting",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.notification_finished_presenting event.", e)
        }
    }

    override fun onNotificationFailedToPresent(notification: NotificareNotification) {
        try {
            EventBroker.dispatchEvent(
                "re.notifica.push.ui.notification_failed_to_present",
                notification.toJson().toReactMap()
            )
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.notification_failed_to_present event.", e)
        }
    }

    override fun onNotificationUrlClicked(notification: NotificareNotification, uri: Uri) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putString("url", uri.toString())

            EventBroker.dispatchEvent("re.notifica.push.ui.notification_url_clicked", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.notification_url_clicked event.", e)
        }
    }

    override fun onActionWillExecute(notification: NotificareNotification, action: NotificareNotification.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("re.notifica.push.ui.action_will_execute", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.action_will_execute event.", e)
        }
    }

    override fun onActionExecuted(notification: NotificareNotification, action: NotificareNotification.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())

            EventBroker.dispatchEvent("re.notifica.push.ui.action_executed", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.action_executed event.", e)
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

            EventBroker.dispatchEvent("re.notifica.push.ui.action_failed_to_execute", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.action_failed_to_execute event.", e)
        }
    }

    override fun onCustomActionReceived(
        notification: NotificareNotification,
        action: NotificareNotification.Action,
        uri: Uri
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("notification", notification.toJson().toReactMap())
            arguments.putMap("action", action.toJson().toReactMap())
            arguments.putString("url", uri.toString())

            EventBroker.dispatchEvent("re.notifica.push.ui.custom_action_received", arguments)
        } catch (e: Exception) {
            logger.error("Failed to emit the re.notifica.push.ui.custom_action_received event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val NAME = "NotificarePushUIModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
