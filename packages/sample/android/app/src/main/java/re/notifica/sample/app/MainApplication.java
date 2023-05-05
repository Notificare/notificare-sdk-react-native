package re.notifica.sample.app;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import re.notifica.iam.react_native.NotificareInAppMessagingPackage;
import re.notifica.inbox.user.react_native.NotificareUserInboxPackage;
import re.notifica.monetize.react_native.NotificareMonetizePackage;
import re.notifica.react_native.NotificarePackage;
import re.notifica.assets.react_native.NotificareAssetsPackage;
import re.notifica.geo.react_native.NotificareGeoPackage;
import re.notifica.inbox.react_native.NotificareInboxPackage;
import re.notifica.loyalty.react_native.NotificareLoyaltyPackage;
import re.notifica.push.react_native.NotificarePushPackage;
import re.notifica.push.ui.react_native.NotificarePushUIPackage;
import re.notifica.scannables.react_native.NotificareScannablesPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new NotificarePackage());
          packages.add(new NotificareAssetsPackage());
          packages.add(new NotificareGeoPackage());
          packages.add(new NotificareInAppMessagingPackage());
          packages.add(new NotificareInboxPackage());
          packages.add(new NotificareLoyaltyPackage());
          packages.add(new NotificareMonetizePackage());
          packages.add(new NotificarePushPackage());
          packages.add(new NotificarePushUIPackage());
          packages.add(new NotificareScannablesPackage());
          packages.add(new NotificareUserInboxPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
