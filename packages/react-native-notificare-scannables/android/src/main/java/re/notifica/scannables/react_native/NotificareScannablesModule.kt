package re.notifica.scannables.react_native

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.internal.NotificareLogger
import re.notifica.scannables.NotificareScannables
import re.notifica.scannables.ktx.scannables
import re.notifica.scannables.models.NotificareScannable
import re.notifica.scannables.models.toJson

public class NotificareScannablesModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), NotificareScannables.ScannableSessionListener {

    override fun getName(): String = "NotificareScannablesModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)

        Notificare.scannables().addListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Notificare.scannables().removeListener(this)
    }

    @ReactMethod
    public fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region NotificareScannables

    @ReactMethod
    public fun canStartNfcScannableSession(promise: Promise) {
        promise.resolve(Notificare.scannables().canStartNfcScannableSession)
    }

    @ReactMethod
    public fun startScannableSession(promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Notificare.scannables().startScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    public fun startNfcScannableSession(promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Notificare.scannables().startNfcScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    public fun startQrCodeScannableSession(promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session without an activity.")
            return
        }

        Notificare.scannables().startQrCodeScannableSession(activity)
        promise.resolve(null)
    }

    @ReactMethod
    public fun fetch(tag: String, promise: Promise) {
        Notificare.scannables().fetch(tag, object : NotificareCallback<NotificareScannable> {
            override fun onSuccess(result: NotificareScannable) {
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

    // endregion

    // region NotificareScannables.ScannableSessionListener

    override fun onScannableDetected(scannable: NotificareScannable) {
        try {
            EventBroker.dispatchEvent("re.notifica.scannables.scannable_detected", scannable.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.scannables.scannable_detected event.", e)
        }
    }

    override fun onScannableSessionError(error: Exception) {
        try {
            EventBroker.dispatchEvent("re.notifica.scannables.scannable_session_failed", error.localizedMessage)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.scannables.scannable_session_failed event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
