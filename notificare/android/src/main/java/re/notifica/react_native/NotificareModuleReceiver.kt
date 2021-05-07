package re.notifica.react_native

import re.notifica.NotificareIntentReceiver
import re.notifica.NotificareLogger
import re.notifica.models.NotificareApplication
import re.notifica.models.NotificareDevice

class NotificareModuleReceiver : NotificareIntentReceiver() {

  override fun onReady(application: NotificareApplication) {
    try {
      NotificareModuleEventManager.dispatchEvent("ready", application.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the ready event.", e)
    }
  }

  override fun onDeviceRegistered(device: NotificareDevice) {
    try {
      NotificareModuleEventManager.dispatchEvent("device_registered", device.toJson().toReactMap())
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the device_registered event.", e)
    }
  }
}
