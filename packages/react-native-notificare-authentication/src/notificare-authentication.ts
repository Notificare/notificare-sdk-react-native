import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NotificareUser } from './models/notificare-user';
import type {
  NotificareUserPreference,
  NotificareUserPreferenceOption,
} from './models/notificare-user-preference';
import type { NotificareUserSegment } from './models/notificare-user-segment';

const LINKING_ERROR =
  `The package 'react-native-notificare-authentication' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeModule = NativeModules.NotificareAuthenticationModule
  ? NativeModules.NotificareAuthenticationModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareAuthentication {
  private static readonly eventEmitter = new NativeEventEmitter(NativeModule);

  //
  // Methods
  //

  public static async isLoggedIn(): Promise<boolean> {
    return await NativeModule.isLoggedIn();
  }

  public static async login(email: string, password: string): Promise<void> {
    await NativeModule.login(email, password);
  }

  public static async logout(): Promise<void> {
    await NativeModule.logout();
  }

  public static async fetchUserDetails(): Promise<NotificareUser> {
    return await NativeModule.fetchUserDetails();
  }

  public static async changePassword(password: string): Promise<void> {
    await NativeModule.changePassword(password);
  }

  public static async generatePushEmailAddress(): Promise<NotificareUser> {
    return await NativeModule.generatePushEmailAddress();
  }

  public static async createAccount(
    email: string,
    password: string,
    name?: string
  ): Promise<void> {
    await NativeModule.createAccount(email, password, name);
  }

  public static async validateUser(token: string): Promise<void> {
    await NativeModule.validateUser(token);
  }

  public static async sendPasswordReset(email: string): Promise<void> {
    await NativeModule.sendPasswordReset(email);
  }

  public static async resetPassword(
    password: string,
    token: string
  ): Promise<void> {
    await NativeModule.resetPassword(password, token);
  }

  public static async fetchUserPreferences(): Promise<
    NotificareUserPreference[]
  > {
    return await NativeModule.fetchUserPreferences();
  }

  public static async fetchUserSegments(): Promise<NotificareUserSegment[]> {
    return await NativeModule.fetchUserSegments();
  }

  public static async addUserSegment(
    segment: NotificareUserSegment
  ): Promise<void> {
    await NativeModule.addUserSegment(segment);
  }

  public static async removeUserSegment(
    segment: NotificareUserSegment
  ): Promise<void> {
    await NativeModule.removeUserSegment(segment);
  }

  public static async addUserSegmentToPreference(
    preference: NotificareUserPreference,
    segment: NotificareUserSegment | NotificareUserPreferenceOption
  ): Promise<void> {
    await NativeModule.addUserSegmentToPreference(preference, segment);
  }

  public static async removeUserSegmentFromPreference(
    preference: NotificareUserPreference,
    segment: NotificareUserSegment | NotificareUserPreferenceOption
  ): Promise<void> {
    await NativeModule.removeUserSegmentFromPreference(preference, segment);
  }

  //
  // Events
  //

  public static onPasswordResetTokenReceived(
    callback: (token: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'password_reset_token_received',
      callback
    );
  }

  public static onValidateUserTokenReceived(
    callback: (token: string) => void
  ): EmitterSubscription {
    return this.eventEmitter.addListener(
      'validate_user_token_received',
      callback
    );
  }
}
