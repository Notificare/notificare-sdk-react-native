package re.notifica.loyalty.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.loyalty.ktx.loyalty
import re.notifica.loyalty.models.NotificarePass

public class NotificareLoyaltyModule internal constructor(context: ReactApplicationContext) :
    NotificareLoyaltyModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    // region Notificare Loyalty

    @ReactMethod
    override fun fetchPassBySerial(serial: String, promise: Promise) {
        Notificare.loyalty().fetchPassBySerial(serial, object : NotificareCallback<NotificarePass> {
            override fun onSuccess(result: NotificarePass) {
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
    override fun fetchPassByBarcode(barcode: String, promise: Promise) {
        Notificare.loyalty().fetchPassByBarcode(barcode, object : NotificareCallback<NotificarePass> {
            override fun onSuccess(result: NotificarePass) {
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
    override fun present(data: ReadableMap, promise: Promise) {
        val pass: NotificarePass

        try {
            pass = NotificarePass.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot present a pass without an activity.")
            return
        }

        Notificare.loyalty().present(activity, pass)
        promise.resolve(null)
    }

    // endregion

    public companion object {
        internal const val NAME = "NotificareLoyaltyModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
