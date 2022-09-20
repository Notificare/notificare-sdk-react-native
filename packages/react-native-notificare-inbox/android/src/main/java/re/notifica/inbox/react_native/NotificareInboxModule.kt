package re.notifica.inbox.react_native

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.inbox.ktx.inbox
import re.notifica.inbox.models.NotificareInboxItem
import re.notifica.inbox.models.fromJson
import re.notifica.inbox.models.toJson
import re.notifica.internal.NotificareLogger
import re.notifica.models.NotificareNotification
import java.util.*

public class NotificareInboxModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val itemsObserver = Observer<SortedSet<NotificareInboxItem>> { items ->
        if (items == null) return@Observer

        try {
            val payload = Arguments.createArray()
            items.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            EventBroker.dispatchEvent("re.notifica.inbox.inbox_updated", payload)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.inbox.inbox_updated event.", e)
        }
    }

    private val badgeObserver = Observer<Int> { badge ->
        if (badge == null) return@Observer

        EventBroker.dispatchEvent("re.notifica.inbox.badge_updated", badge)
    }

    override fun getName(): String = "NotificareInboxModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)

        onMainThread {
            Notificare.inbox().observableItems.observeForever(itemsObserver)
            Notificare.inbox().observableBadge.observeForever(badgeObserver)
        }
    }

    override fun invalidate() {
        super.invalidate()

        onMainThread {
            Notificare.inbox().observableItems.removeObserver(itemsObserver)
            Notificare.inbox().observableBadge.removeObserver(badgeObserver)
        }
    }

    @ReactMethod
    public fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Inbox

    @ReactMethod
    public fun getItems(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Notificare.inbox().items.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun getBadge(promise: Promise) {
        promise.resolve(Notificare.inbox().badge)
    }

    @ReactMethod
    public fun refresh(promise: Promise) {
        Notificare.inbox().refresh()
        promise.resolve(null)
    }

    @ReactMethod
    public fun open(data: ReadableMap, promise: Promise) {
        val item: NotificareInboxItem

        try {
            item = NotificareInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.inbox().open(item, object : NotificareCallback<NotificareNotification> {
            override fun onSuccess(result: NotificareNotification) {
                try {
                    promise.resolve(result.toJson().toReactMap())
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun markAsRead(data: ReadableMap, promise: Promise) {
        val item: NotificareInboxItem

        try {
            item = NotificareInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.inbox().markAsRead(item, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun markAllAsRead(promise: Promise) {
        Notificare.inbox().markAllAsRead(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun remove(data: ReadableMap, promise: Promise) {
        val item: NotificareInboxItem

        try {
            item = NotificareInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.inbox().remove(item, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun clear(promise: Promise) {
        Notificare.inbox().clear(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"

        internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
    }
}
