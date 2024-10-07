package re.notifica.geo.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

public abstract class NotificareGeoModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    // Notificare Geo

    public abstract fun hasLocationServicesEnabled(promise: Promise)
    public abstract fun hasBluetoothEnabled(promise: Promise)
    public abstract fun getMonitoredRegions(promise: Promise)
    public abstract fun getEnteredRegions(promise: Promise)
    public abstract fun enableLocationUpdates(promise: Promise)
    public abstract fun disableLocationUpdates(promise: Promise)
}
