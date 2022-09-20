package re.notifica.react_native

import android.content.Context
import re.notifica.NotificareIntentReceiver
import re.notifica.internal.NotificareLogger
import re.notifica.models.NotificareApplication
import re.notifica.models.NotificareDevice

internal class NotificareModuleIntentReceiver : NotificareIntentReceiver() {
    override fun onReady(context: Context, application: NotificareApplication) {
        try {
            EventBroker.dispatchEvent("re.notifica.ready", application.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.ready event.", e)
        }
    }

    override fun onUnlaunched(context: Context) {
        EventBroker.dispatchEvent("re.notifica.unlaunched", null)
    }

    override fun onDeviceRegistered(context: Context, device: NotificareDevice) {
        try {
            EventBroker.dispatchEvent("re.notifica.device_registered", device.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.device_registered event.", e)
        }
    }
}
