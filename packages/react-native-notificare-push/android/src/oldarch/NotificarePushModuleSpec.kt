package re.notifica.push.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray

public abstract class NotificarePushModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    // region iOS only methods (empty implementation)

    public abstract fun setAuthorizationOptions(options: ReadableArray, promise: Promise)
    public abstract fun setCategoryOptions(options: ReadableArray, promise: Promise)
    public abstract fun setPresentationOptions(options: ReadableArray, promise: Promise)

    // end region

    public abstract fun hasRemoteNotificationsEnabled(promise: Promise)
    public abstract fun getTransport(promise: Promise)
    public abstract fun getSubscriptionId(promise: Promise)
    public abstract fun allowedUI(promise: Promise)
    public abstract fun enableRemoteNotifications(promise: Promise)
    public abstract fun disableRemoteNotifications(promise: Promise)
}
