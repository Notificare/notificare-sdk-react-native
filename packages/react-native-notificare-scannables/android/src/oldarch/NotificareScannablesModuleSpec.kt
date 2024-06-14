package re.notifica.scannables.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

public abstract class NotificareScannablesModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun addListener(eventName: String)
    public abstract fun removeListeners(count: Double)

    public abstract fun canStartNfcScannableSession(promise: Promise)
    public abstract fun startScannableSession(promise: Promise)
    public abstract fun startNfcScannableSession(promise: Promise)
    public abstract fun startQrCodeScannableSession(promise: Promise)
    public abstract fun fetch(tag: String, promise: Promise)
}
