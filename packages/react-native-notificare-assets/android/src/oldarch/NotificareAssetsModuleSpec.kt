package re.notifica.assets.react_native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

public abstract class NotificareAssetsModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    public abstract fun fetch(group: String, promise: Promise)
}
