package re.notifica.push.react_native

import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import re.notifica.NotificareLogger

object NotificarePushModuleEventManager {

  private var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null
  private val eventQueue = mutableListOf<Event>()

  fun setup(reactContext: ReactContext) {
    eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).also { emitter ->
      if (eventQueue.isNotEmpty()) {
        NotificareLogger.debug("Processing event queue with ${eventQueue.size} items.")
        eventQueue.forEach { emitter.emit(it.name, it.payload) }
        eventQueue.clear()
      }
    }
  }

  fun dispatchEvent(name: String, payload: Any) {
    val eventEmitter = eventEmitter ?: run {
      eventQueue.add(Event(name, payload))
      return
    }

    eventEmitter.emit(name, payload)
  }

  private data class Event(
    val name: String,
    val payload: Any
  )
}
