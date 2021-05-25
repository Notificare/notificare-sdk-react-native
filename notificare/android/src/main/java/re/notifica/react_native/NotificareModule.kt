package re.notifica.react_native

import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.models.NotificareApplication
import re.notifica.models.NotificareDoNotDisturb
import re.notifica.models.NotificareNotification
import re.notifica.models.NotificareUserData

class NotificareModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "NotificareModule"

  override fun initialize() {
    super.initialize()

    NotificareModuleEventManager.setup(reactApplicationContext)
    Notificare.intentReceiver = NotificareModuleReceiver::class.java
  }

  // region Notificare

  @ReactMethod
  fun getConfigured(promise: Promise) {
    promise.resolve(Notificare.isConfigured)
  }

  @ReactMethod
  fun getReady(promise: Promise) {
    promise.resolve(Notificare.isReady)
  }

  @ReactMethod
  fun getUseAdvancedLogging(promise: Promise) {
    promise.resolve(Notificare.useAdvancedLogging)
  }

  @ReactMethod
  fun setUseAdvancedLogging(useAdvancedLogging: Boolean, promise: Promise) {
    Notificare.useAdvancedLogging = useAdvancedLogging
    promise.resolve(null)
  }

  @ReactMethod
  fun configure(applicationKey: String, applicationSecret: String, promise: Promise) {
    Notificare.configure(reactApplicationContext, applicationKey, applicationSecret)
    promise.resolve(null)
  }

  @ReactMethod
  fun launch(promise: Promise) {
    Notificare.launch()
    promise.resolve(null)
  }

  @ReactMethod
  fun unlaunch(promise: Promise) {
    Notificare.unlaunch()
    promise.resolve(null)
  }

  @ReactMethod
  fun getApplication(promise: Promise) {
    promise.resolve(Notificare.application?.toJson()?.toReactMap())
  }

  @ReactMethod
  fun fetchApplication(promise: Promise) {
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
  fun fetchNotification(id: String, promise: Promise) {
    Notificare.fetchNotification(id, object : NotificareCallback<NotificareNotification> {
      override fun onSuccess(result: NotificareNotification) {
        promise.resolve(result.toJson().toReactMap())
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  //endregion

  // region Notificare Device Manager

  @ReactMethod
  fun getCurrentDevice(promise: Promise) {
    promise.resolve(Notificare.deviceManager.currentDevice?.toJson()?.toReactMap())
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
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun register(userId: String?, userName: String?, promise: Promise) {
    Notificare.deviceManager.register(userId, userName, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun fetchTags(promise: Promise) {
    Notificare.deviceManager.fetchTags(object : NotificareCallback<List<String>> {
      override fun onSuccess(result: List<String>) {
        promise.resolve(Arguments.fromArray(result.toTypedArray()))
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
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
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun addTags(payload: ReadableArray, promise: Promise) {
    val tags = payload.toArrayList().map { it.toString() }

    Notificare.deviceManager.addTags(tags, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
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
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun removeTags(payload: ReadableArray, promise: Promise) {
    val tags = payload.toArrayList().map { it.toString() }

    Notificare.deviceManager.removeTags(tags, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
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
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun fetchDoNotDisturb(promise: Promise) {
    Notificare.deviceManager.fetchDoNotDisturb(object : NotificareCallback<NotificareDoNotDisturb?> {
      override fun onSuccess(result: NotificareDoNotDisturb?) {
        promise.resolve(result?.toJson()?.toReactMap())
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun updateDoNotDisturb(payload: ReadableMap, promise: Promise) {
    val dnd = payload.toJson().let { NotificareDoNotDisturb.fromJson(it) }

    Notificare.deviceManager.updateDoNotDisturb(dnd, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
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
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  @ReactMethod
  fun fetchUserData(promise: Promise) {
    Notificare.deviceManager.fetchUserData(object : NotificareCallback<NotificareUserData> {
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
  fun updateUserData(payload: ReadableMap, promise: Promise) {
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

    Notificare.deviceManager.updateUserData(userData, object : NotificareCallback<Unit> {
      override fun onSuccess(result: Unit) {
        promise.resolve(null)
      }

      override fun onFailure(e: Exception) {
        promise.reject(DEFAULT_ERROR_CODE, e)
      }
    })
  }

  // endregion

  companion object {
    internal val DEFAULT_ERROR_CODE = "notificare_error"
  }
}
