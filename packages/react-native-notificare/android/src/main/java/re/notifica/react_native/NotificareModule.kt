package re.notifica.react_native

import android.app.Activity
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.internal.NotificareLogger
import re.notifica.ktx.device
import re.notifica.ktx.events
import re.notifica.models.NotificareApplication
import re.notifica.models.NotificareDoNotDisturb
import re.notifica.models.NotificareDynamicLink
import re.notifica.models.NotificareEvent
import re.notifica.models.NotificareEventData
import re.notifica.models.NotificareNotification
import re.notifica.models.NotificareUserData

public class NotificareModule internal constructor(context: ReactApplicationContext) :
    NotificareModuleSpec(context), ActivityEventListener {

    private var lifecycleEventListener: LifecycleEventListener? = null

    override fun getName(): String {
        return NAME
    }

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)
        Notificare.intentReceiver = NotificareModuleIntentReceiver::class.java

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        processInitialIntent()
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        processIntent(intent)
    }

    // endregion

    @ReactMethod
    override fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare

    @ReactMethod
    override fun isConfigured(promise: Promise) {
        promise.resolve(Notificare.isConfigured)
    }

    @ReactMethod
    override fun isReady(promise: Promise) {
        promise.resolve(Notificare.isReady)
    }

    @ReactMethod
    override fun launch(promise: Promise) {
        Notificare.launch()
        promise.resolve(null)
    }

    @ReactMethod
    override fun unlaunch(promise: Promise) {
        Notificare.unlaunch()
        promise.resolve(null)
    }

    @ReactMethod
    override fun getApplication(promise: Promise) {
        promise.resolve(Notificare.application?.toJson()?.toReactMap())
    }

    @ReactMethod
    override fun fetchApplication(promise: Promise) {
        Notificare.fetchApplication(object : NotificareCallback<NotificareApplication> {
            override fun onSuccess(result: NotificareApplication) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchNotification(id: String, promise: Promise) {
        Notificare.fetchNotification(id, object : NotificareCallback<NotificareNotification> {
            override fun onSuccess(result: NotificareNotification) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchDynamicLink(url: String, promise: Promise) {
        val uri = Uri.parse(url)

        Notificare.fetchDynamicLink(uri, object : NotificareCallback<NotificareDynamicLink> {
            override fun onSuccess(result: NotificareDynamicLink) {
                promise.resolve(result.toJson().toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun canEvaluateDeferredLink(promise: Promise) {
        Notificare.canEvaluateDeferredLink(object : NotificareCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                promise.resolve(result)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun evaluateDeferredLink(promise: Promise) {
        Notificare.evaluateDeferredLink(object : NotificareCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                promise.resolve(result)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    // region Notificare device module

    @ReactMethod
    override fun getCurrentDevice(promise: Promise) {
        promise.resolve(Notificare.device().currentDevice?.toJson()?.toReactMap())
    }

    @ReactMethod
    override fun getPreferredLanguage(promise: Promise) {
        promise.resolve(Notificare.device().preferredLanguage)
    }

    @ReactMethod
    override fun updatePreferredLanguage(language: String?, promise: Promise) {
        Notificare.device().updatePreferredLanguage(language, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun registerUser(userId: String?, userName: String?, promise: Promise) {
        Notificare.device().register(userId, userName, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchTags(promise: Promise) {
        Notificare.device().fetchTags(object : NotificareCallback<List<String>> {
            override fun onSuccess(result: List<String>) {
                promise.resolve(Arguments.fromArray(result.toTypedArray()))
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun addTag(tag: String, promise: Promise) {
        Notificare.device().addTag(tag, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun addTags(payload: ReadableArray, promise: Promise) {
        val tags = payload.toArrayList().map { it.toString() }

        Notificare.device().addTags(tags, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun removeTag(tag: String, promise: Promise) {
        Notificare.device().removeTag(tag, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun removeTags(payload: ReadableArray, promise: Promise) {
        val tags = payload.toArrayList().map { it.toString() }

        Notificare.device().removeTags(tags, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun clearTags(promise: Promise) {
        Notificare.device().clearTags(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchDoNotDisturb(promise: Promise) {
        Notificare.device().fetchDoNotDisturb(object : NotificareCallback<NotificareDoNotDisturb?> {
            override fun onSuccess(result: NotificareDoNotDisturb?) {
                promise.resolve(result?.toJson()?.toReactMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun updateDoNotDisturb(payload: ReadableMap, promise: Promise) {
        val dnd = payload.toJson().let { NotificareDoNotDisturb.fromJson(it) }

        Notificare.device().updateDoNotDisturb(dnd, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun clearDoNotDisturb(promise: Promise) {
        Notificare.device().clearDoNotDisturb(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun fetchUserData(promise: Promise) {
        Notificare.device().fetchUserData(object : NotificareCallback<NotificareUserData> {
            override fun onSuccess(result: NotificareUserData) {
                val userData = result.let { userData ->
                    Arguments.createMap().apply {
                        userData.forEach {
                            putString(it.key, it.value)
                        }
                    }
                }

                promise.resolve(userData)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    override fun updateUserData(payload: ReadableMap, promise: Promise) {
        val userData: NotificareUserData = payload.let { reactMap ->
            val parsed = mutableMapOf<String, String>()

            val iterator = reactMap.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                val value = reactMap.getString(key)

                if (value != null) {
                    parsed[key] = value
                }
            }

            parsed
        }

        Notificare.device().updateUserData(userData, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    // endregion

    // region Notificare events module

    @ReactMethod
    override fun logCustom(event: String, dataMap: ReadableMap?, promise: Promise) {
        val data: NotificareEventData?

        try {
            data = dataMap?.toJson()?.let { NotificareEvent.createData(it) }
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.events().logCustom(event, data, object : NotificareCallback<Unit> {
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
        // Try handling the test device intent.
        if (Notificare.handleTestDeviceIntent(intent)) return

        // Try handling the dynamic link intent.
        val activity = currentActivity
        if (activity != null && Notificare.handleDynamicLinkIntent(activity, intent)) return

        val url = intent.data?.toString()
        if (url != null) {
            EventBroker.dispatchEvent("re.notifica.url_opened", url)
        }
    }

    public companion object {
        internal const val NAME = "NotificareModule"
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
