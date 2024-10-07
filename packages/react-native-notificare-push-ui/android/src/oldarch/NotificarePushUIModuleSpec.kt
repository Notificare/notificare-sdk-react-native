package re.notifica.push.ui.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

public abstract class NotificarePushUIModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    public abstract fun presentNotification(data: ReadableMap, promise: Promise)
    public abstract fun presentAction(notificationData: ReadableMap, actionData: ReadableMap, promise: Promise)
}
