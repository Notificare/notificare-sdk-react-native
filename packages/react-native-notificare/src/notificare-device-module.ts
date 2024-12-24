import { NativeModules, Platform } from 'react-native';
import type { NotificareDevice } from './models/notificare-device';
import type { NotificareDoNotDisturb } from './models/notificare-do-not-disturb';

const LINKING_ERROR =
  `The package 'react-native-notificare' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NotificareModule = isTurboModuleEnabled
  ? require('./NativeNotificareModule').default
  : NativeModules.NotificareModule;

const NativeModule = NotificareModule
  ? NotificareModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class NotificareDeviceModule {
  /**
   * @returns The current {@link NotificareDevice} information.
   */
  public async getCurrentDevice(): Promise<NotificareDevice | null> {
    return await NativeModule.getCurrentDevice();
  }

  /**
   * @returns The preferred language of the current device for notifications and
   * messages.
   */
  public async getPreferredLanguage(): Promise<string | null> {
    return await NativeModule.getPreferredLanguage();
  }

  /**
   * Updates the preferred language setting for the device.
   *
   * @param language The preferred language code.
   */
  public async updatePreferredLanguage(language: string | null): Promise<void> {
    await NativeModule.updatePreferredLanguage(language);
  }

  /**
   * Registers a user for the device.
   *
   * To register the device anonymously, set both `userId` and `userName` to `null`.
   *
   * @param userId Optional user identifier.
   * @param userName Optional username.
   *
   * @deprecated Use updateUser() instead.
   */
  public async register(
    userId: string | null,
    userName: string | null
  ): Promise<void> {
    await NativeModule.registerUser(userId, userName);
  }

  /**
   * Updates the user information for the device.
   *
   * To register the device anonymously, set both `userId` and `userName` to `null`.
   *
   * @param userId Optional user identifier.
   * @param userName Optional username.
   */
  public async updateUser(
    userId: string | null,
    userName: string | null
  ): Promise<void> {
    await NativeModule.updateUser(userId, userName);
  }

  /**
   * Fetches the tags associated with the device.
   *
   * @return A list of tags currently associated with the device.
   */
  public async fetchTags(): Promise<string[]> {
    return await NativeModule.fetchTags();
  }

  /**
   * Adds a single tag to the device.
   *
   * @param tag The tag to add.
   */
  public async addTag(tag: string): Promise<void> {
    await NativeModule.addTag(tag);
  }

  /**
   * Adds multiple tags to the device.
   *
   * @param tags A list of tags to add.
   */
  public async addTags(tags: string[]): Promise<void> {
    await NativeModule.addTags(tags);
  }

  /**
   * Removes a specific tag from the device.
   *
   * @param tag The tag to remove.
   */
  public async removeTag(tag: string): Promise<void> {
    await NativeModule.removeTag(tag);
  }

  /**
   * Removes multiple tags from the device.
   *
   * @param tags A list of tags to remove.
   */
  public async removeTags(tags: string[]): Promise<void> {
    await NativeModule.removeTags(tags);
  }

  /**
   * Clears all tags from the device.
   */
  public async clearTags(): Promise<void> {
    await NativeModule.clearTags();
  }

  /**
   * Fetches the "Do Not Disturb" (DND) settings for the device.
   *
   * @return The current {@link NotificareDoNotDisturb} settings, or `null` if
   * none are set.
   */
  public async fetchDoNotDisturb(): Promise<NotificareDoNotDisturb | null> {
    return await NativeModule.fetchDoNotDisturb();
  }

  /**
   * Updates the "Do Not Disturb" (DND) settings for the device.
   *
   * @param dnd The new {@link NotificareDoNotDisturb} settings to apply.
   */
  public async updateDoNotDisturb(dnd: NotificareDoNotDisturb): Promise<void> {
    await NativeModule.updateDoNotDisturb(dnd);
  }

  /**
   * Clears the "Do Not Disturb" (DND) settings for the device.
   */
  public async clearDoNotDisturb(): Promise<void> {
    await NativeModule.clearDoNotDisturb();
  }

  /**
   * Fetches the user data associated with the device.
   *
   * @return The current user data.
   */
  public async fetchUserData(): Promise<Record<string, string>> {
    return await NativeModule.fetchUserData();
  }

  /**
   * Updates the custom user data associated with the device.
   *
   * @param userData The updated user data to associate with the device.
   */
  public async updateUserData(userData: Record<string, string>): Promise<void> {
    await NativeModule.updateUserData(userData);
  }
}
