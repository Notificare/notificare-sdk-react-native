package re.notifica.react_native.modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import re.notifica.Notificare
import re.notifica.react_native.NotificareReceiver
import re.notifica.react_native.events.NotificareEventManager

class CoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificareReactModule"

    override fun initialize() {
        super.initialize()
        NotificareEventManager.initialize(reactApplicationContext)
    }

    @ReactMethod
    fun getConfigured(promise: Promise) {
        promise.resolve(Notificare.isConfigured)
    }

    @ReactMethod
    fun getReady(promise: Promise) {
        promise.resolve(Notificare.isReady)
    }

    @ReactMethod
    fun configure(applicationKey: String, applicationSecret: String, promise: Promise) {
        Notificare.configure(reactApplicationContext, applicationKey, applicationSecret)
        promise.resolve(null)
    }

    @ReactMethod
    fun launch(promise: Promise) {
        Notificare.intentReceiver = NotificareReceiver::class.java
        Notificare.launch()
        promise.resolve(null)
    }

    @ReactMethod
    fun unlaunch(promise: Promise) {
        Notificare.unlaunch()
        promise.resolve(null)
    }
}
