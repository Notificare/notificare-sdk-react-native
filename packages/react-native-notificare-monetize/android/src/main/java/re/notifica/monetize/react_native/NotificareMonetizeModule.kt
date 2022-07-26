package re.notifica.monetize.react_native

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.facebook.react.bridge.*
import re.notifica.Notificare
import re.notifica.NotificareCallback
import re.notifica.internal.NotificareLogger
import re.notifica.monetize.NotificareMonetize
import re.notifica.monetize.ktx.monetize
import re.notifica.monetize.models.NotificareProduct
import re.notifica.monetize.models.NotificarePurchase

public class NotificareMonetizeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), NotificareMonetize.Listener {

    private val productsObserver = Observer<List<NotificareProduct>> { products ->
        if (products == null) return@Observer

        try {
            val arguments = Arguments.createArray()
            products.forEach { arguments.pushMap(it.toJson().toReactMap()) }

            EventBroker.dispatchEvent("products_updated", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the products_updated event.", e)
        }
    }

    private val purchasesObserver = Observer<List<NotificarePurchase>> { purchases ->
        if (purchases == null) return@Observer

        try {
            val arguments = Arguments.createArray()
            purchases.forEach { arguments.pushMap(it.toJson().toReactMap()) }

            EventBroker.dispatchEvent("purchases_updated", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the purchases_updated event.", e)
        }
    }

    override fun getName(): String = "NotificareMonetizeModule"

    override fun initialize() {
        super.initialize()

        EventBroker.setup(reactApplicationContext)

        onMainThread {
            Notificare.monetize().observableProducts.observeForever(productsObserver)
            Notificare.monetize().observablePurchases.observeForever(purchasesObserver)
        }
    }

    override fun invalidate() {
        super.invalidate()

        onMainThread {
            Notificare.monetize().observableProducts.removeObserver(productsObserver)
            Notificare.monetize().observablePurchases.removeObserver(purchasesObserver)
        }
    }

    @ReactMethod
    public fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // region Notificare Monetize

    @ReactMethod
    public fun getProducts(promise: Promise) {
        try {
            val products = Notificare.monetize().products

            val arguments = Arguments.createArray()
            products.forEach { arguments.pushMap(it.toJson().toReactMap()) }

            promise.resolve(arguments)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun getPurchases(promise: Promise) {
        try {
            val purchases = Notificare.monetize().purchases

            val arguments = Arguments.createArray()
            purchases.forEach { arguments.pushMap(it.toJson().toReactMap()) }

            promise.resolve(arguments)
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
        }
    }

    @ReactMethod
    public fun refresh(promise: Promise) {
        Notificare.monetize().refresh(object : NotificareCallback<Unit> {
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }

            override fun onFailure(e: Exception) {
                promise.reject(DEFAULT_ERROR_CODE, e)
            }
        })
    }

    @ReactMethod
    public fun startPurchaseFlow(data: ReadableMap, promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject(DEFAULT_ERROR_CODE, "Cannot start a purchase without an activity.")
            return
        }

        val product: NotificareProduct = try {
            NotificareProduct.fromJson(data.toJson())
        } catch (e: Exception) {
            promise.reject(DEFAULT_ERROR_CODE, e)
            return
        }

        Notificare.monetize().startPurchaseFlow(activity, product)
    }

    // endregion

    // region NotificareMonetize.Listener

    override fun onBillingSetupFinished() {
        try {
            EventBroker.dispatchEvent("billing_setup_finished", null)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the billing_setup_failed event.", e)
        }
    }

    override fun onBillingSetupFailed(code: Int, message: String) {
        try {
            val arguments = Arguments.createMap().apply {
                putInt("code", code)
                putString("message", message)
            }

            EventBroker.dispatchEvent("billing_setup_failed", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the billing_setup_failed event.", e)
        }
    }

    override fun onPurchaseFinished(purchase: NotificarePurchase) {
        try {
            EventBroker.dispatchEvent("purchase_finished", purchase.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the purchase_finished event.", e)
        }
    }

    override fun onPurchaseRestored(purchase: NotificarePurchase) {
        try {
            EventBroker.dispatchEvent("purchase_restored", purchase.toJson().toReactMap())
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the purchase_restored event.", e)
        }
    }

    override fun onPurchaseCanceled() {
        try {
            EventBroker.dispatchEvent("purchase_canceled", null)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the purchase_canceled event.", e)
        }
    }

    override fun onPurchaseFailed(code: Int, message: String) {
        try {
            val arguments = Arguments.createMap().apply {
                putInt("code", code)
                putString("message", message)
            }

            EventBroker.dispatchEvent("purchase_failed", arguments)
        } catch (e: Exception) {
            NotificareLogger.error("Failed to emit the purchase_failed event.", e)
        }
    }

    // endregion

    public companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"

        internal fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)
    }
}
