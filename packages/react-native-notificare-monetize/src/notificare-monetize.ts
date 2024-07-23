import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareProduct } from './models/notificare-product';
import type { NotificarePurchase } from './models/notificare-purchase';
const LINKING_ERROR =
  `The package 'react-native-notificare-monetize' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareMonetizeModule
  ? NativeModules.NotificareMonetizeModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareMonetize {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async getProducts(): Promise<NotificareProduct[]> {
    return await NativeModule.getProducts();
  }

  public static async getPurchases(): Promise<NotificarePurchase[]> {
    return await NativeModule.getPurchases();
  }

  public static async refresh(): Promise<void> {
    await NativeModule.refresh();
  }

  public static async startPurchaseFlow(
    product: NotificareProduct
  ): Promise<void> {
    await NativeModule.startPurchaseFlow(product);
  }

  //
  // Events
  //

  public static onProductsUpdated(
    callback: (products: NotificareProduct[]) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.products_updated',
      callback
    );
  }

  public static onPurchasesUpdated(
    callback: (purchases: NotificarePurchase[]) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.purchases_updated',
      callback
    );
  }

  public static onBillingSetupFinished(
    callback: () => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.billing_setup_finished',
      callback
    );
  }

  public static onBillingSetupFailed(
    callback: (data: {
      readonly code: number;
      readonly message: string;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.billing_setup_failed',
      callback
    );
  }

  public static onPurchaseFinished(
    callback: (purchase: NotificarePurchase) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.purchase_finished',
      callback
    );
  }

  public static onPurchaseRestored(
    callback: (purchase: NotificarePurchase) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.purchase_restored',
      callback
    );
  }

  public static onPurchaseCanceled(callback: () => void): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.purchase_canceled',
      callback
    );
  }

  public static onPurchaseFailed(
    callback: (data: {
      readonly code?: number | null;
      readonly message?: string | null;
      readonly errorMessage?: string | null;
    }) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      're.notifica.monetize.purchase_failed',
      callback
    );
  }
}
