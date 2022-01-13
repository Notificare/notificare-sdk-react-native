export interface NotificareUser {
  readonly id: string;
  readonly name: string;
  readonly pushEmailAddress?: string;
  readonly segments: string[];
  readonly registrationDate: string;
  readonly lastActive: string;
}
