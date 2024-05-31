package re.notifica.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

public abstract class NotificareModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    // region Notificare

    public abstract fun isConfigured(promise: Promise)
    public abstract fun isReady(promise: Promise)
    public abstract fun launch(promise: Promise)
    public abstract fun unlaunch(promise: Promise)
    public abstract fun getApplication(promise: Promise)
    public abstract fun fetchApplication(promise: Promise)
    public abstract fun fetchNotification(id: String, promise: Promise)
    public abstract fun fetchDynamicLink(url: String, promise: Promise)
    public abstract fun canEvaluateDeferredLink(promise: Promise)
    public abstract fun evaluateDeferredLink(promise: Promise)

    // region Notificare device module

    public abstract fun getCurrentDevice(promise: Promise)
    public abstract fun getPreferredLanguage(promise: Promise)
    public abstract fun updatePreferredLanguage(language: String?, promise: Promise)
    public abstract fun registerUser(userId: String?, userName: String?, promise: Promise)
    public abstract fun fetchTags(promise: Promise)
    public abstract fun addTag(tag: String, promise: Promise)
    public abstract fun addTags(payload: ReadableArray, promise: Promise)
    public abstract fun removeTag(tag: String, promise: Promise)
    public abstract fun removeTags(payload: ReadableArray, promise: Promise)
    public abstract fun clearTags(promise: Promise)
    public abstract fun fetchDoNotDisturb(promise: Promise)
    public abstract fun updateDoNotDisturb(payload: ReadableMap, promise: Promise)
    public abstract fun clearDoNotDisturb(promise: Promise)
    public abstract fun fetchUserData(promise: Promise)
    public abstract fun updateUserData(payload: ReadableMap, promise: Promise)

    // region Notificare events module

    public abstract fun logCustom(event: String, dataMap: ReadableMap?, promise: Promise)
}
