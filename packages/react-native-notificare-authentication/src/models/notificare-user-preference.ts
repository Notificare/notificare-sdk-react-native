export interface NotificareUserPreference {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly options: NotificareUserPreferenceOption[];
  readonly position: number;
}

export interface NotificareUserPreferenceOption {
  readonly label: string;
  readonly segmentId: string;
  readonly selected: boolean;
}
