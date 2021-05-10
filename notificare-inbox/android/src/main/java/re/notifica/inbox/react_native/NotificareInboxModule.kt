package re.notifica.inbox.react_native

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.facebook.react.bridge.*
import re.notifica.NotificareCallback
import re.notifica.NotificareLogger
import re.notifica.inbox.NotificareInbox
import re.notifica.inbox.models.NotificareInboxItem
import re.notifica.models.NotificareNotification
import java.util.*

class NotificareInboxModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private val itemsObserver = Observer<SortedSet<NotificareInboxItem>> { items ->
    if (items == null) return@Observer

    try {
      val payload = Arguments.createArray()
      items.forEach {
        payload.pushMap(it.toJson().toReactMap())
      }

      NotificareInboxModuleEventManager.dispatchEvent("inbox_updated", payload)
    } catch (e: Exception) {
      NotificareLogger.error("Failed to emit the inbox_updated event.", e)
    }
  }

  private val badgeObserver = Observer<Int> { badge ->
    if (badge == null) return@Observer

    NotificareInboxModuleEventManager.dispatchEvent("badge_updated", badge)
  }

  override fun getName(): String = "NotificareInboxModule"

  override fun initialize() {
    super.initialize()

    NotificareInboxModuleEventManager.setup(reactApplicationContext)

    onMainThread {
      NotificareInbox.observableItems.observeForever(itemsObserver)
      NotificareInbox.observableBadge.observeForever(badgeObserver)
    }
  }

  override fun onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy()

    onMainThread {
      NotificareInbox.observableItems.removeObserver(itemsObserver)
      NotificareInbox.observableBadge.removeObserver(badgeObserver)
    }
  }

  @ReactMethod
  fun getItems(promise: Promise) {
    try {
      val payload = Arguments.createArray()
      NotificareInbox.items.forEach {
        payload.pushMap(it.toJson().toReactMap())
      }

      promise.resolve(payload)
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
    }
  }

  @ReactMethod
  fun getBadge(promise: Promise) {
    promise.resolve(NotificareInbox.badge)
  }

  @ReactMethod
  fun refresh(promise: Promise) {
    NotificareInbox.refresh()
    promise.resolve(null)
  }

  @ReactMethod
  fun open(data: ReadableMap, promise: Promise) {
    val item: NotificareInboxItem

    try {
      item = NotificareInboxItem.fromJson(data.toJson())
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
      return
    }

    NotificareInbox.open(item, object : NotificareCallback<NotificareNotification> {
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
  fun markAsRead(data: ReadableMap, promise: Promise) {
    val item: NotificareInboxItem

    try {
      item = NotificareInboxItem.fromJson(data.toJson())
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
      return
    }

    NotificareInbox.markAsRead(item, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun markAllAsRead(promise: Promise) {
    NotificareInbox.markAllAsRead(object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun remove(data: ReadableMap, promise: Promise) {
    val item: NotificareInboxItem

    try {
      item = NotificareInboxItem.fromJson(data.toJson())
    } catch (e: Exception) {
      promise.reject(DEFAULT_ERROR_CODE, e)
      return
    }

    NotificareInbox.remove(item, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun clear(promise: Promise) {
    NotificareInbox.clear(object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  companion object {
    internal const val DEFAULT_ERROR_CODE = "notificare_error"

    internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
  }
}
