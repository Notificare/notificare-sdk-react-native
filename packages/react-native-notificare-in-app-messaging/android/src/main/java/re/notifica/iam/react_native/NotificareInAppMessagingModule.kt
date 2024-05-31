package re.notifica.iam.react_native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import re.notifica.Notificare
import re.notifica.iam.NotificareInAppMessaging
import re.notifica.iam.ktx.inAppMessaging
import re.notifica.iam.models.NotificareInAppMessage
import re.notifica.internal.NotificareLogger

public class NotificareInAppMessagingModule internal constructor(context: ReactApplicationContext) :
    NotificareInAppMessagingModuleSpec(context), NotificareInAppMessaging.MessageLifecycleListener {

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
        Notificare.inAppMessaging().addLifecycleListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Notificare.inAppMessaging().removeLifecycleListener(this)
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare In-App Messaging

    @ReactMethod
    override fun hasMessagesSuppressed(promise: Promise) {
        promise.resolve(Notificare.inAppMessaging().hasMessagesSuppressed)
    }

    @ReactMethod
    override fun setMessagesSuppressed(data: ReadableMap, promise: Promise) {
        val arguments = data.toJson()
        val suppressed = try {
            arguments.getBoolean("suppressed")
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val evaluateContext =
            if (!arguments.isNull("evaluateContext")) {
                arguments.getBoolean("evaluateContext")
            } else {
                false
            }

        Notificare.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext)

        promise.resolve(null)
    }

    // endregion

    // region NotificareInAppMessaging.MessageLifecycleListener

    override fun onMessagePresented(message: NotificareInAppMessage) {
        try {
            EventBroker.dispatchEvent("re.notifica.iam.message_presented", message.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.iam.message_presented event.", e)
        }
    }

    override fun onMessageFinishedPresenting(message: NotificareInAppMessage) {
        try {
            EventBroker.dispatchEvent("re.notifica.iam.message_finished_presenting", message.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("re.notifica.iam.Failed to emit the message_finished_presenting event.", e)
        }
    }

    override fun onMessageFailedToPresent(message: NotificareInAppMessage) {
        try {
            EventBroker.dispatchEvent("re.notifica.iam.message_failed_to_present", message.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.iam.message_failed_to_present event.", e)
        }
    }

    override fun onActionExecuted(message: NotificareInAppMessage, action: NotificareInAppMessage.Action) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("message", message.toJson().toReactMap())
            arguments.putMap("action", message.toJson().toReactMap())

            EventBroker.dispatchEvent("re.notifica.iam.action_executed", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.iam.action_executed event.", e)
        }
    }

    override fun onActionFailedToExecute(
        message: NotificareInAppMessage,
        action: NotificareInAppMessage.Action,
        error: Exception?
    ) {
        try {
            val arguments = Arguments.createMap()
            arguments.putMap("message", message.toJson().toReactMap())
            arguments.putMap("action", message.toJson().toReactMap())

            if (error != null) {
                arguments.putString("error", error.message)
            }

            EventBroker.dispatchEvent("re.notifica.iam.action_failed_to_execute", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.iam.action_failed_to_execute event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val NAME = "NotificareInAppMessagingModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
