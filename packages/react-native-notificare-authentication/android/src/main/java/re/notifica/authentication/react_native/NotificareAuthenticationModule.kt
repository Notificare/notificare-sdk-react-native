package re.notifica.authentication.react_native

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.authentication.ktx.authentication
import re.notifica.authentication.models.NotificareUser
import re.notifica.authentication.models.NotificareUserPreference
import re.notifica.authentication.models.NotificareUserSegment
import re.notifica.internal.NotificareLogger

public class NotificareAuthenticationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    override fun getName(): String = "NotificareAuthenticationModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)

        // Listen to incoming intents.
        reactApplicationContext.addActivityEventListener(this)

        val intent = reactApplicationContext.currentActivity?.intent
        if (intent != null) onNewIntent(intent)
    }

    // region ActivityEventListener

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {}

    override fun onNewIntent(intent: Intent) {
        val passwordResetToken = Notificare.authentication().parsePasswordResetToken(intent)
        if (passwordResetToken != null) {
            EventBroker.dispatchEvent("password_reset_token_received", passwordResetToken)
            return
        }

        val validateUserToken = Notificare.authentication().parseValidateUserToken(intent)
        if (validateUserToken != null) {
            EventBroker.dispatchEvent("validate_user_token_received", validateUserToken)
            return
        }
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

    // region Notificare Authentication

    @ReactMethod
    public fun isLoggedIn(promise: Promise) {
        promise.resolve(Notificare.authentication().isLoggedIn)
    }

    @ReactMethod
    public fun login(email: String, password: String, promise: Promise) {
        Notificare.authentication().login(email, password, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun logout(promise: Promise) {
        Notificare.authentication().logout(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun fetchUserDetails(promise: Promise) {
        Notificare.authentication().fetchUserDetails(object : NotificareCallback<NotificareUser> {
            override fun onSuccess(result: NotificareUser) {
                try {
                    promise.resolve(result.toJson().toReactMap())
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun changePassword(password: String, promise: Promise) {
        Notificare.authentication().changePassword(password, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun generatePushEmailAddress(promise: Promise) {
        Notificare.authentication().generatePushEmailAddress(object : NotificareCallback<NotificareUser> {
            override fun onSuccess(result: NotificareUser) {
                try {
                    promise.resolve(result.toJson().toReactMap())
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun createAccount(email: String, password: String, name: String?, promise: Promise) {
        Notificare.authentication().createAccount(email, password, name, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun validateUser(token: String, promise: Promise) {
        Notificare.authentication().validateUser(token, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun sendPasswordReset(email: String, promise: Promise) {
        Notificare.authentication().sendPasswordReset(email, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun resetPassword(password: String, token: String, promise: Promise) {
        Notificare.authentication().resetPassword(password, token, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun fetchUserPreferences(promise: Promise) {
        Notificare.authentication().fetchUserPreferences(object : NotificareCallback<List<NotificareUserPreference>> {
            override fun onSuccess(result: List<NotificareUserPreference>) {
                try {
                    val payload = Arguments.createArray()
                    result.forEach { payload.pushMap(it.toJson().toReactMap()) }

                    promise.resolve(payload)
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun fetchUserSegments(promise: Promise) {
        Notificare.authentication().fetchUserSegments(object : NotificareCallback<List<NotificareUserSegment>> {
            override fun onSuccess(result: List<NotificareUserSegment>) {
                try {
                    val payload = Arguments.createArray()
                    result.forEach { payload.pushMap(it.toJson().toReactMap()) }

                    promise.resolve(payload)
                } catch (e: Exception) {
                    promise.reject(DEFAULT_ERROR_CODE, e)
                }
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun addUserSegment(data: ReadableMap, promise: Promise) {
        val segment: NotificareUserSegment

        try {
            segment = NotificareUserSegment.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.authentication().addUserSegment(segment, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun removeUserSegment(data: ReadableMap, promise: Promise) {
        val segment: NotificareUserSegment

        try {
            segment = NotificareUserSegment.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.authentication().removeUserSegment(segment, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun addUserSegmentToPreference(preferenceData: ReadableMap, segmentData: ReadableMap, promise: Promise) {
        val preference: NotificareUserPreference

        try {
            preference = NotificareUserPreference.fromJson(preferenceData.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        try {
            val segment = NotificareUserSegment.fromJson(segmentData.toJson())
            Notificare.authentication()
                .addUserSegmentToPreference(segment, preference, object : NotificareCallback<Unit> {
                    override fun onSuccess(result: Unit) {
                        promise.resolve(null)
                    }

                    override fun onFailure(e: Exception) {
                        promise.reject(DEFAULT_ERROR_CODE, e)
                    }
                })

            return
        } catch (e: Exception) {
            NotificareLogger.debug("Failed to parse segment data into a NotificareUserSegment.", e)
        }

        try {
            val option = NotificareUserPreference.Option.fromJson(segmentData.toJson())
            Notificare.authentication()
                .addUserSegmentToPreference(option, preference, object : NotificareCallback<Unit> {
                    override fun onSuccess(result: Unit) {
                        promise.resolve(null)
                    }

                    override fun onFailure(e: Exception) {
                        promise.reject(DEFAULT_ERROR_CODE, e)
                    }
                })

            return
        } catch (e: Exception) {
            NotificareLogger.debug("Failed to parse segment data into a NotificareUserPreference.Option.", e)
        }

        promise.reject(
            DEFAULT_ERROR_CODE,
            "To execute this method, you must provide either a NotificareUserSegment or a NotificarePreferenceOption."
        )
    }

    @ReactMethod
    public fun removeUserSegmentFromPreference(preferenceData: ReadableMap, segmentData: ReadableMap, promise: Promise) {
        val preference: NotificareUserPreference

        try {
            preference = NotificareUserPreference.fromJson(preferenceData.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        try {
            val segment = NotificareUserSegment.fromJson(segmentData.toJson())
            Notificare.authentication()
                .removeUserSegmentFromPreference(segment, preference, object : NotificareCallback<Unit> {
                    override fun onSuccess(result: Unit) {
                        promise.resolve(null)
                    }

                    override fun onFailure(e: Exception) {
                        promise.reject(DEFAULT_ERROR_CODE, e)
                    }
                })

            return
        } catch (e: Exception) {
            NotificareLogger.debug("Failed to parse segment data into a NotificareUserSegment.", e)
        }

        try {
            val option = NotificareUserPreference.Option.fromJson(segmentData.toJson())
            Notificare.authentication()
                .removeUserSegmentFromPreference(option, preference, object : NotificareCallback<Unit> {
                    override fun onSuccess(result: Unit) {
                        promise.resolve(null)
                    }

                    override fun onFailure(e: Exception) {
                        promise.reject(DEFAULT_ERROR_CODE, e)
                    }
                })

            return
        } catch (e: Exception) {
            NotificareLogger.debug("Failed to parse segment data into a NotificareUserPreference.Option.", e)
        }

        promise.reject(
            DEFAULT_ERROR_CODE,
            "To execute this method, you must provide either a NotificareUserSegment or a NotificarePreferenceOption."
        )
    }

    // endregion

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
    }
}
