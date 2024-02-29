package re.notifica.sample.app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import re.notifica.iam.react_native.NotificareInAppMessagingPackage
import re.notifica.inbox.user.react_native.NotificareUserInboxPackage
import re.notifica.monetize.react_native.NotificareMonetizePackage;
import re.notifica.react_native.NotificarePackage
import re.notifica.assets.react_native.NotificareAssetsPackage
import re.notifica.geo.react_native.NotificareGeoPackage
import re.notifica.inbox.react_native.NotificareInboxPackage
import re.notifica.loyalty.react_native.NotificareLoyaltyPackage
import re.notifica.push.react_native.NotificarePushPackage
import re.notifica.push.ui.react_native.NotificarePushUIPackage
import re.notifica.scannables.react_native.NotificareScannablesPackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
                add(NotificarePackage())
                add(NotificareAssetsPackage())
                add(NotificareGeoPackage())
                add(NotificareInAppMessagingPackage())
                add(NotificareInboxPackage())
                add(NotificareLoyaltyPackage())
                add(NotificareMonetizePackage())
                add(NotificarePushPackage())
                add(NotificarePushUIPackage())
                add(NotificareScannablesPackage())
                add(NotificareUserInboxPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }
}
