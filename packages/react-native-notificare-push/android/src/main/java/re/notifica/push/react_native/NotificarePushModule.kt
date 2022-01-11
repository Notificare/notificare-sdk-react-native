package re.notifica.push.react_native

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.push.ktx.push

public class NotificarePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    ActivityEventListener {

    override fun getName(): String = "NotificarePushModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
        Notificare.push().intentReceiver = NotificarePushModuleIntentReceiver::class.java

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        val intent = reactApplicationContext.currentActivity?.intent
        if (intent != null) onNewIntent(intent)
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        Notificare.push().handleTrampolineIntent(intent)
    }

    // endregion

    @ReactMethod
    public fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Push

    @ReactMethod
    public fun hasRemoteNotificationsEnabled(promise: Promise) {
        promise.resolve(Notificare.push().hasRemoteNotificationsEnabled)
    }

    @ReactMethod
    public fun allowedUI(promise: Promise) {
        promise.resolve(Notificare.push().allowedUI)
    }

    @ReactMethod
    public fun enableRemoteNotifications(promise: Promise) {
        Notificare.push().enableRemoteNotifications()
        promise.resolve(null)
    }

    @ReactMethod
    public fun disableRemoteNotifications(promise: Promise) {
        Notificare.push().disableRemoteNotifications()
        promise.resolve(null)
    }

    // endregion
}
