package re.notifica.assets.react_native

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.assets.ktx.assets
import re.notifica.assets.models.NotificareAsset

public class NotificareAssetsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificareAssetsModule"

    @ReactMethod
    public fun fetch(group: String, promise: Promise) {
        Notificare.assets().fetch(group, object : NotificareCallback<List<NotificareAsset>> {
            override fun onSuccess(result: List<NotificareAsset>) {
                try {
                    val payload = Arguments.createArray()
                    result.forEach {
                        payload.pushMap(it.toJson().toReactMap())
                    }

                    promise.resolve(payload)
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
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
