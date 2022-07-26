export interface NotificareProduct {
  readonly id: string;
  readonly identifier: string;
  readonly name: string;
  readonly type: string;
  readonly storeDetails?: NotificareProductStoreDetails | null;
}

export interface NotificareProductStoreDetails {
  readonly name?: string | null;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly currencyCode: string;
}
