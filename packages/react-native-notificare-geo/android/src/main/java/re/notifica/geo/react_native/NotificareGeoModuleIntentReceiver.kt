package re.notifica.geo.react_native

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.Arguments
import re.notifica.geo.NotificareGeoIntentReceiver
import re.notifica.geo.models.NotificareBeacon
import re.notifica.geo.models.NotificareLocation
import re.notifica.geo.models.NotificareRegion
import re.notifica.geo.models.toJson
import re.notifica.geo.react_native.NotificareGeoModuleHeadlessService.Companion.processHeadlessTask
import re.notifica.internal.NotificareLogger

internal class NotificareGeoModuleIntentReceiver : NotificareGeoIntentReceiver() {
    override fun onLocationUpdated(context: Context, location: NotificareLocation) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.LocationUpdated(location)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("re.notifica.geo.location_updated", location.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.location_updated event.", e)
        }
    }

    override fun onRegionEntered(context: Context, region: NotificareRegion) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.RegionEntered(region)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("re.notifica.geo.region_entered", region.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.region_entered event.", e)
        }
    }

    override fun onRegionExited(context: Context, region: NotificareRegion) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.RegionExited(region)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("re.notifica.geo.region_exited", region.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.region_exited event.", e)
        }
    }

    override fun onBeaconEntered(context: Context, beacon: NotificareBeacon) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.BeaconEntered(beacon)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("re.notifica.geo.beacon_entered", beacon.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacon_entered event.", e)
        }
    }

    override fun onBeaconExited(context: Context, beacon: NotificareBeacon) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.BeaconExited(beacon)
            processHeadlessTask(context, event)

            return
        }

        try {
            EventBroker.dispatchEvent("re.notifica.geo.beacon_exited", beacon.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacon_exited event.", e)
        }
    }

    override fun onBeaconsRanged(context: Context, region: NotificareRegion, beacons: List<NotificareBeacon>) {
        if (!isAppOnForeground(context)) {
            val event = NotificareGeoModuleHeadlessService.BackgroundEvent.BeaconsRanged(beacons, region)
            processHeadlessTask(context, event)

            return
        }

        try {
            val payload = Arguments.createMap()
            payload.putMap("region", region.toJson().toReactMap())
            payload.putArray("beacons", Arguments.createArray().apply {
                beacons.forEach { pushMap(it.toJson().toReactMap()) }
            })

            EventBroker.dispatchEvent("re.notifica.geo.beacons_ranged", payload)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacons_ranged event.", e)
        }
    }

    private fun isAppOnForeground(context: Context): Boolean {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false
        val packageName: String = context.packageName
        for (appProcess in appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                appProcess.processName == packageName
            ) {
                return true
            }
        }

        return false
    }
}
