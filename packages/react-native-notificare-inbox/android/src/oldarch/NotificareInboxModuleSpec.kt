package re.notifica.inbox.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

public abstract class NotificareInboxModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    // Notificare Inbox

    public abstract fun getItems(promise: Promise)
    public abstract fun getBadge(promise: Promise)
    public abstract fun refresh(promise: Promise)
    public abstract fun open(data: ReadableMap, promise: Promise)
    public abstract fun markAsRead(data: ReadableMap, promise: Promise)
    public abstract fun markAllAsRead(promise: Promise)
    public abstract fun remove(data: ReadableMap, promise: Promise)
    public abstract fun clear(promise: Promise)
}
