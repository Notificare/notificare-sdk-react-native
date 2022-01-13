export interface NotificarePass {
  readonly id: string;
  readonly type?: string;
  readonly version: number;
  readonly passbook?: string;
  readonly template?: string;
  readonly serial: string;
  readonly barcode: string;
  readonly redeem: string;
  readonly redeemHistory: NotificarePassRedemption[];
  readonly limit: number;
  readonly token: string;
  readonly data: Record<string, any>;
  readonly date: string;
  readonly googlePaySaveLink?: string;
}

export interface NotificarePassRedemption {
  readonly comments?: string;
  readonly date: string;
}
