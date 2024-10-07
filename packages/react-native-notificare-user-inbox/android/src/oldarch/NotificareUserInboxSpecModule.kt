package re.notifica.inbox.user.react_native

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

public abstract class NotificareUserInboxModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun parseResponseFromJson(data: ReadableMap, promise: Promise)
    public abstract fun parseResponseFromString(json: String, promise: Promise)
    public abstract fun open(data: ReadableMap, promise: Promise)
    public abstract fun markAsRead(data: ReadableMap, promise: Promise)
    public abstract fun remove(data: ReadableMap, promise: Promise)
}
