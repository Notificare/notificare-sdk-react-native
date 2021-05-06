package re.notifica.react_native.modules

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.callbacks.*
import re.notifica.models.NotificareDoNotDisturb
import re.notifica.models.NotificareUserData
import re.notifica.react_native.NotificarePackage
import re.notifica.react_native.models.NotificareDoNotDisturb
import re.notifica.react_native.models.toWritableMap

class DeviceManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NotificareDeviceManagerReactModule"

    @ReactMethod
    fun getCurrentDevice(promise: Promise) {
        promise.resolve(Notificare.deviceManager.currentDevice?.toWritableMap())
    }

    @ReactMethod
    fun register(userId: String?, userName: String?, promise: Promise) {
        Notificare.deviceManager.register(userId, userName, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun getPreferredLanguage(promise: Promise) {
        promise.resolve(Notificare.deviceManager.preferredLanguage)
    }

    @ReactMethod
    fun updatePreferredLanguage(language: String?, promise: Promise) {
        Notificare.deviceManager.updatePreferredLanguage(language, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun fetchTags(promise: Promise) {
        Notificare.deviceManager.fetchTags(object : NotificareCallback<List<String>> {
            override fun onSuccess(result: List<String>) {
                promise.resolve(Arguments.fromList(result))
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun addTag(tag: String, promise: Promise) {
        Notificare.deviceManager.addTag(tag, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun addTags(tags: ReadableArray, promise: Promise) {
        val theTags = mutableListOf<String>().apply {
            for (i in 0 until tags.size()) {
                add(requireNotNull(tags.getString(i)))
            }
        }

        Notificare.deviceManager.addTags(theTags, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun removeTag(tag: String, promise: Promise) {
        Notificare.deviceManager.removeTag(tag, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun removeTags(tags: ReadableArray, promise: Promise) {
        val theTags = mutableListOf<String>().apply {
            for (i in 0 until tags.size()) {
                add(requireNotNull(tags.getString(i)))
            }
        }

        Notificare.deviceManager.removeTags(theTags, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun clearTags(promise: Promise) {
        Notificare.deviceManager.clearTags(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun fetchDoNotDisturb(promise: Promise) {
        Notificare.deviceManager.fetchDoNotDisturb(object : NotificareCallback<NotificareDoNotDisturb?> {
            override fun onSuccess(result: NotificareDoNotDisturb?) {
                promise.resolve(result?.toWritableMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun updateDoNotDisturb(dnd: ReadableMap, promise: Promise) {
        Notificare.deviceManager.updateDoNotDisturb(NotificareDoNotDisturb(dnd), object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun clearDoNotDisturb(promise: Promise) {
        Notificare.deviceManager.clearDoNotDisturb(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun fetchUserData(promise: Promise) {
        Notificare.deviceManager.fetchUserData(object : NotificareCallback<NotificareUserData?> {
            override fun onSuccess(result: NotificareUserData?) {
                promise.resolve(result?.toWritableMap())
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    fun updateUserData(userData: ReadableMap, promise: Promise) {
        val theUserData: NotificareUserData = mutableMapOf<String, String>().apply {
            userData.entryIterator.forEach {
                this[it.key] = it.value as String
            }
        }

        Notificare.deviceManager.updateUserData(theUserData, object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(NotificarePackage.DEFAULT_ERROR_CODE, e)
            }
        })
    }
}
