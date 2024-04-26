package re.notifica.geo.react_native

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import org.json.JSONArray
import org.json.JSONObject
import re.notifica.geo.models.NotificareBeacon
import re.notifica.geo.models.NotificareLocation
import re.notifica.geo.models.NotificareRegion
import re.notifica.geo.models.toJson
import java.io.Serializable

internal class NotificareGeoModuleHeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return intent?.extras?.let {
            val event = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                it.getSerializable(BUNDLE_BACKGROUND_EVENT_KEY, BackgroundEvent::class.java) ?: return null
            } else {
                @Suppress("DEPRECATION")
                it.getSerializable(BUNDLE_BACKGROUND_EVENT_KEY) as? BackgroundEvent ?: return null
            }

            HeadlessJsTaskConfig(
                event.task.key,
                JSONObject(event.payload).toReactMap(),
                TASK_TIMEOUT,
                true
            )
        }
    }

    internal companion object {
        private const val TASK_TIMEOUT: Long = 60000
        private const val BUNDLE_BACKGROUND_EVENT_KEY = "backgroundEvent"

        internal fun processHeadlessTask(context: Context, event: BackgroundEvent) {
            val intent = Intent(context, NotificareGeoModuleHeadlessService::class.java)
            val bundle = Bundle().also {
                it.putSerializable(BUNDLE_BACKGROUND_EVENT_KEY, event)
            }

            intent.putExtras(bundle)
            context.startService(intent)
            acquireWakeLockNow(context)
        }
    }

    internal enum class HeadlessTask(val key: String) {
        LOCATION_UPDATED(key = "re.notifica.geo.background_task_location_updated"),
        REGION_ENTERED(key = "re.notifica.geo.background_task_region_entered"),
        REGION_EXITED(key = "re.notifica.geo.background_task_region_exited"),
        BEACON_ENTERED(key = "re.notifica.geo.background_task_beacon_entered"),
        BEACON_EXITED(key = "re.notifica.geo.background_task_beacon_exited"),
        BEACONS_RANGED(key = "re.notifica.geo.background_task_beacons_ranged"),
    }

    internal sealed class BackgroundEvent : Serializable {
        abstract val task: HeadlessTask
        abstract val payload: String

        internal class LocationUpdated(
            location: NotificareLocation
        ) : BackgroundEvent() {
            override val task = HeadlessTask.LOCATION_UPDATED
            override val payload = location.toJson().toString()
        }

        internal class RegionEntered(
            region: NotificareRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.REGION_ENTERED
            override val payload = region.toJson().toString()
        }

        internal class RegionExited(
            region: NotificareRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.REGION_EXITED
            override val payload = region.toJson().toString()
        }

        internal class BeaconEntered(
            beacon: NotificareBeacon
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACON_ENTERED
            override val payload = beacon.toJson().toString()
        }

        internal class BeaconExited(
            beacon: NotificareBeacon
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACON_EXITED
            override val payload = beacon.toJson().toString()
        }

        internal class BeaconsRanged(
            beacons: List<NotificareBeacon>,
            region: NotificareRegion
        ) : BackgroundEvent() {
            override val task = HeadlessTask.BEACONS_RANGED
            override val payload = JSONObject().apply {
                put("region", region.toJson())
                put("beacons", JSONArray(beacons.map { it.toJson() }))
            }.toString()
        }
    }
}
