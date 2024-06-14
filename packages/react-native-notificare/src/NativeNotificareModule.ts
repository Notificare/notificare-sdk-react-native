import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';
import type { NotificareApplication } from './models/notificare-application';
import type { NotificareNotification } from './models/notificare-notification';
import type { NotificareDynamicLink } from './models/notificare-dynamic-link';
import type { NotificareDevice } from './models/notificare-device';
import type { NotificareDoNotDisturb } from './models/notificare-do-not-disturb';

export interface Spec extends TurboModule {
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;

  // Notificare

  isConfigured(): Promise<boolean>;
  isReady(): Promise<boolean>;
  launch(): Promise<void>;
  unlaunch(): Promise<void>;
  getApplication(): Promise<NotificareApplication | null>;
  fetchApplication(): Promise<NotificareApplication>;
  fetchNotification(id: string): Promise<NotificareNotification>;
  fetchDynamicLink(url: string): Promise<NotificareDynamicLink>;
  canEvaluateDeferredLink(): Promise<boolean>;
  evaluateDeferredLink(): Promise<boolean>;

  // Notificare device

  getCurrentDevice(): Promise<NotificareDevice | null>;
  getPreferredLanguage(): Promise<string | null>;
  updatePreferredLanguage(language: string | null): Promise<void>;
  registerUser(userId: string | null, userName: string | null): Promise<void>;
  fetchTags(): Promise<string[]>;
  addTag(tag: string): Promise<void>;
  addTags(tags: string[]): Promise<void>;
  removeTag(tag: string): Promise<void>;
  removeTags(tags: string[]): Promise<void>;
  clearTags(): Promise<void>;
  fetchDoNotDisturb(): Promise<NotificareDoNotDisturb | null>;
  updateDoNotDisturb(dnd: Object): Promise<void>;
  clearDoNotDisturb(): Promise<void>;
  fetchUserData(): Promise<Record<string, string>>;
  updateUserData(userData: Object): Promise<void>;

  // Notificare events

  logCustom(event: string, data?: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NotificareModule');
