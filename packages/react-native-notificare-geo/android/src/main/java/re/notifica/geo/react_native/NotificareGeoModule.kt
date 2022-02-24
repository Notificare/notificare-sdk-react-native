package re.notifica.geo.react_native

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.geo.NotificareGeo
import re.notifica.geo.ktx.geo
import re.notifica.geo.models.NotificareBeacon
import re.notifica.geo.models.NotificareLocation
import re.notifica.geo.models.NotificareRegion
import re.notifica.geo.models.toJson
import re.notifica.internal.NotificareLogger

public class NotificareGeoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    NotificareGeo.Listener {

    override fun getName(): String = "NotificareGeoModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
        Notificare.geo().addListener(this)
    }

    override fun invalidate() {
        super.invalidate()

        Notificare.geo().removeListener(this)
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

    // region NotificareGeo.Listener

    override fun onLocationUpdated(location: NotificareLocation) {
        try {
            EventBroker.dispatchEvent("location_updated", location.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the location_updated event.", e)
        }
    }

    override fun onRegionEntered(region: NotificareRegion) {
        try {
            EventBroker.dispatchEvent("region_entered", region.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the region_entered event.", e)
        }
    }

    override fun onRegionExited(region: NotificareRegion) {
        try {
            EventBroker.dispatchEvent("region_exited", region.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the region_exited event.", e)
        }
    }

    override fun onBeaconEntered(beacon: NotificareBeacon) {
        try {
            EventBroker.dispatchEvent("beacon_entered", beacon.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the beacon_entered event.", e)
        }
    }

    override fun onBeaconExited(beacon: NotificareBeacon) {
        try {
            EventBroker.dispatchEvent("beacon_exited", beacon.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the beacon_exited event.", e)
        }
    }

    override fun onBeaconsRanged(region: NotificareRegion, beacons: List<NotificareBeacon>) {
        try {
            val payload = Arguments.createMap()
            payload.putMap("region", region.toJson().toReactMap())
            payload.putArray("beacons", Arguments.createArray().apply {
                beacons.forEach { pushMap(it.toJson().toReactMap()) }
            })

            EventBroker.dispatchEvent("beacons_ranged", payload)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the beacons_ranged event.", e)
        }
    }

    // endregion
}
