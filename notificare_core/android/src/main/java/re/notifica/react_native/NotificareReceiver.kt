package re.notifica.react_native

import re.notifica.app.NotificareIntentReceiver
import re.notifica.models.NotificareDevice
import re.notifica.react_native.events.NotificareEvent
import re.notifica.react_native.events.NotificareEventManager

class NotificareReceiver : NotificareIntentReceiver() {

    override fun onDeviceRegistered(device: NotificareDevice) {
        NotificareEventManager.send(
            NotificareEvent.DeviceRegistered(device)
        )
    }

    override fun onReady() {
        NotificareEventManager.send(
            NotificareEvent.Ready
        )
    }
}
