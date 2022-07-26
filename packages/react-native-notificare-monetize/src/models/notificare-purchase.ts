export interface NotificarePurchase {
  readonly id: string;
  readonly productIdentifier: string;
  readonly time: string;

  // Android-specific properties
  readonly originalJson?: string | null;
  readonly packageName?: string | null;
  readonly token?: string | null;
  readonly signature?: string | null;
  readonly isAcknowledged?: boolean | null;

  // iOS-specific properties
  readonly receipt?: string | null;
}
