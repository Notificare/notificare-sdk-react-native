package re.notifica.geo.react_native

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.geo.ktx.geo
import re.notifica.geo.models.toJson

public class NotificareGeoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificareGeoModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
    }

    @ReactMethod
    public fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Geo

    @ReactMethod
    public fun hasLocationServicesEnabled(promise: Promise) {
        promise.resolve(Notificare.geo().hasLocationServicesEnabled)
    }

    @ReactMethod
    public fun hasBluetoothEnabled(promise: Promise) {
        promise.resolve(Notificare.geo().hasBluetoothEnabled)
    }

    @ReactMethod
    public fun getMonitoredRegions(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Notificare.geo().monitoredRegions.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun getEnteredRegions(promise: Promise) {
        try {
            val payload = Arguments.createArray()
            Notificare.geo().enteredRegions.forEach {
                payload.pushMap(it.toJson().toReactMap())
            }

            promise.resolve(payload)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun enableLocationUpdates(promise: Promise) {
        Notificare.geo().enableLocationUpdates()
        promise.resolve(null)
    }

    @ReactMethod
    public fun disableLocationUpdates(promise: Promise) {
        Notificare.geo().disableLocationUpdates()
        promise.resolve(null)
    }

    // endregion

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
