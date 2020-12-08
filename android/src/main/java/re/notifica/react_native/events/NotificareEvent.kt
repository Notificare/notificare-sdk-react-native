package re.notifica.react_native.events

import re.notifica.models.NotificareDevice
import re.notifica.react_native.models.toWritableMap

internal sealed class NotificareEvent {

    abstract val type: Type
    abstract val payload: Any?

    enum class Type(val id: String) {
        READY(id = "ready"),
        DEVICE_REGISTERED(id = "device_registered"),
    }

    object Ready : NotificareEvent() {
        override val type = Type.READY
        override val payload: Any? = null
    }

    class DeviceRegistered(
        device: NotificareDevice,
    ) : NotificareEvent() {
        override val type = Type.DEVICE_REGISTERED
        override val payload = device.toWritableMap()
    }
}
