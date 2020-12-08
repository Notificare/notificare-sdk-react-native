package re.notifica.react_native

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import re.notifica.internal.NotificareUtils
import re.notifica.react_native.modules.CoreModule
import re.notifica.react_native.modules.DeviceManagerModule

class NotificarePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf<NativeModule>(
            CoreModule(reactContext),
            DeviceManagerModule(reactContext),
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    companion object {
        internal const val DEFAULT_ERROR_CODE = "notificare_error"
        internal val moshi = NotificareUtils.createMoshi()
    }
}
