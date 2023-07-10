package re.notifica.push.react_native

import android.app.Activity
import android.content.Intent
import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.internal.NotificareLogger
import re.notifica.push.ktx.push

public class NotificarePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    ActivityEventListener {

    private var lifecycleEventListener: LifecycleEventListener? = null

    private val allowedUIObserver = Observer<Boolean> { allowedUI ->
        if (allowedUI == null) return@Observer

        EventBroker.dispatchEvent("re.notifica.push.notification_settings_changed", allowedUI)
    }

    override fun getName(): String = "NotificarePushModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
        Notificare.push().intentReceiver = NotificarePushModuleIntentReceiver::class.java

        onMainThread {
            Notificare.push().observableAllowedUI.observeForever(allowedUIObserver)
        }

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        processInitialIntent()
    }

    override fun invalidate() {
        super.invalidate()

        onMainThread {
            Notificare.push().observableAllowedUI.removeObserver(allowedUIObserver)
        }
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        processIntent(intent)
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

    private fun processInitialIntent() {
        val activity = currentActivity ?: run {
            waitForActivityAndProcessInitialIntent()
            return
        }

        activity.intent?.also { processIntent(it) }
    }

    private fun waitForActivityAndProcessInitialIntent() {
        if (lifecycleEventListener != null) {
            NotificareLogger.warning("Cannot await an Activity for more than one call.")
            return
        }

        lifecycleEventListener = object : LifecycleEventListener {
            override fun onHostResume() {
                val activity = currentActivity

                if (activity == null) {
                    NotificareLogger.warning("Cannot process the initial intent when the host resumed without an activity.")
                }

                activity?.intent?.also { processIntent(it) }

                lifecycleEventListener?.also { reactApplicationContext.removeLifecycleEventListener(it) }
                lifecycleEventListener = null
            }

            override fun onHostPause() {}

            override fun onHostDestroy() {}
        }.also { reactApplicationContext.addLifecycleEventListener(it) }
    }

    private fun processIntent(intent: Intent) {
        Notificare.push().handleTrampolineIntent(intent)
    }

    public companion object {
        internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
    }
}
