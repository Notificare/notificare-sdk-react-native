package re.notifica.sample.app;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import re.notifica.monetize.react_native.NotificareMonetizePackage;
import re.notifica.react_native.NotificarePackage;
import re.notifica.assets.react_native.NotificareAssetsPackage;
import re.notifica.authentication.react_native.NotificareAuthenticationPackage;
import re.notifica.geo.react_native.NotificareGeoPackage;
import re.notifica.inbox.react_native.NotificareInboxPackage;
import re.notifica.loyalty.react_native.NotificareLoyaltyPackage;
import re.notifica.push.react_native.NotificarePushPackage;
import re.notifica.push.ui.react_native.NotificarePushUIPackage;
import re.notifica.scannables.react_native.NotificareScannablesPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
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
          packages.add(new NotificareAuthenticationPackage());
          packages.add(new NotificareGeoPackage());
          packages.add(new NotificareInboxPackage());
          packages.add(new NotificareLoyaltyPackage());
          packages.add(new NotificareMonetizePackage());
          packages.add(new NotificarePushPackage());
          packages.add(new NotificarePushUIPackage());
          packages.add(new NotificareScannablesPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
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
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("re.notifica.sample.app.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
