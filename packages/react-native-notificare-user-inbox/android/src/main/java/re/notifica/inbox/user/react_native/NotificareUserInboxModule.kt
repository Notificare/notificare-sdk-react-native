package re.notifica.inbox.user.react_native

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.inbox.user.ktx.userInbox
import re.notifica.inbox.user.models.NotificareUserInboxItem
import re.notifica.models.NotificareNotification

public class NotificareUserInboxModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificareUserInboxModule"

    @ReactMethod
    public fun parseResponseFromJson(data: ReadableMap, promise: Promise) {
        try {
            val response = Notificare.userInbox().parseResponse(data.toJson())
            promise.resolve(response.toJson().toReactMap())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun parseResponseFromString(json: String, promise: Promise) {
        try {
            val response = Notificare.userInbox().parseResponse(json)
            promise.resolve(response.toJson().toReactMap())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun open(data: ReadableMap, promise: Promise) {
        val item: NotificareUserInboxItem

        try {
            item = NotificareUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.userInbox().open(item, object : NotificareCallback<NotificareNotification> {
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
        val item: NotificareUserInboxItem

        try {
            item = NotificareUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.userInbox().markAsRead(item, object : NotificareCallback<Unit> {
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
        val item: NotificareUserInboxItem

        try {
            item = NotificareUserInboxItem.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.userInbox().remove(item, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
