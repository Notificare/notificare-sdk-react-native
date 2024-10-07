package re.notifica.push.react_native

import android.app.Activity
import android.content.Intent
import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.push.ktx.push
import re.notifica.push.models.NotificarePushSubscription

public class NotificarePushModule internal constructor(context: ReactApplicationContext) :
    NotificarePushModuleSpec(context), ActivityEventListener {

    private var lifecycleEventListener: LifecycleEventListener? = null

    private val allowedUIObserver = Observer<Boolean> { allowedUI ->
        if (allowedUI == null) return@Observer

        EventBroker.dispatchEvent("re.notifica.push.notification_settings_changed", allowedUI)
    }

    private val subscriptionObserver = Observer<NotificarePushSubscription?> { subscription ->
        EventBroker.dispatchEvent(
            "re.notifica.push.subscription_changed",
            subscription?.toJson()?.toReactMap()
        )
    }

    override fun initialize() {
        super.initialize()

        logger.hasDebugLoggingEnabled = Notificare.options?.debugLoggingEnabled ?: false

        EventBroker.setup(reactApplicationContext)
        Notificare.push().intentReceiver = NotificarePushModuleIntentReceiver::class.java

        onMainThread {
            Notificare.push().observableAllowedUI.observeForever(allowedUIObserver)
            Notificare.push().observableSubscription.observeForever(subscriptionObserver)
        }

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        processInitialIntent()
    }

    override fun invalidate() {
        super.invalidate()

        onMainThread {
            Notificare.push().observableAllowedUI.removeObserver(allowedUIObserver)
            Notificare.push().observableSubscription.removeObserver(subscriptionObserver)
        }
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        processIntent(intent)
    }

    // endregion

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region iOS only methods (empty implementation)

    @ReactMethod
    override fun setAuthorizationOptions(options: ReadableArray, promise: Promise) {
        // Keep: Required for RN generated methods with New Architecture.
    }

    @ReactMethod
    override fun setCategoryOptions(options: ReadableArray, promise: Promise) {
        // Keep: Required for RN generated methods with New Architecture.
    }

    @ReactMethod
    override fun setPresentationOptions(options: ReadableArray, promise: Promise) {
        // Keep: Required for RN generated methods with New Architecture.
    }

    // end region

    // region Notificare Push

    @ReactMethod
    override fun hasRemoteNotificationsEnabled(promise: Promise) {
        promise.resolve(Notificare.push().hasRemoteNotificationsEnabled)
    }

    @ReactMethod
    override fun getTransport(promise: Promise) {
        promise.resolve(Notificare.push().transport?.rawValue)
    }

    @ReactMethod
    override fun getSubscription(promise: Promise) {
        promise.resolve(Notificare.push().subscription?.toJson()?.toReactMap())
    }

    @ReactMethod
    override fun allowedUI(promise: Promise) {
        promise.resolve(Notificare.push().allowedUI)
    }

    @ReactMethod
    override fun enableRemoteNotifications(promise: Promise) {
        Notificare.push().enableRemoteNotifications(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun disableRemoteNotifications(promise: Promise) {
        Notificare.push().disableRemoteNotifications(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
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
            logger.warning("Cannot await an Activity for more than one call.")
            return
        }

        lifecycleEventListener = object : LifecycleEventListener {
            override fun onHostResume() {
                val activity = currentActivity

                if (activity == null) {
                    logger.warning("Cannot process the initial intent when the host resumed without an activity.")
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
        internal const val NAME = "NotificarePushModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"

        internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
    }
}
