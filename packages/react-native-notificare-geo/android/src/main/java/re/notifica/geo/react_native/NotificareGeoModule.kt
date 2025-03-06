package re.notifica.geo.react_native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import re.notifica.Notificare
import re.notifica.geo.ktx.geo

public class NotificareGeoModule internal constructor(context: ReactApplicationContext) :
    NotificareGeoModuleSpec(context) {

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Notificare.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Geo

    @ReactMethod
    override fun hasLocationServicesEnabled(promise: Promise) {
        promise.resolve(Notificare.geo().hasLocationServicesEnabled)
    }

    @ReactMethod
    override fun hasBluetoothEnabled(promise: Promise) {
        promise.resolve(Notificare.geo().hasBluetoothEnabled)
    }

    @ReactMethod
    override fun getMonitoredRegions(promise: Promise) {
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
    override fun getEnteredRegions(promise: Promise) {
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
    override fun enableLocationUpdates(promise: Promise) {
        Notificare.geo().enableLocationUpdates()
        promise.resolve(null)
    }

    @ReactMethod
    override fun disableLocationUpdates(promise: Promise) {
        Notificare.geo().disableLocationUpdates()
        promise.resolve(null)
    }

    // endregion

    public companion object {
        internal const val NAME = "NotificareGeoModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
