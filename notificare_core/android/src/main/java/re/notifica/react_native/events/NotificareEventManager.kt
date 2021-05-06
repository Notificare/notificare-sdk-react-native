package re.notifica.react_native.events

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

internal object NotificareEventManager {

    private var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

    fun initialize(reactContext: ReactContext) {
        eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    }

    fun send(event: NotificareEvent) {
        val eventEmitter = eventEmitter ?: return

        Handler(Looper.getMainLooper()).post {
            eventEmitter.emit(event.type.id, event.payload)
        }
    }
}
