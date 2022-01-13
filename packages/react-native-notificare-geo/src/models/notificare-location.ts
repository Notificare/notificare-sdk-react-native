export interface NotificareLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly altitude: number;
  readonly course: number;
  readonly speed: number;
  readonly floor?: number;
  readonly horizontalAccuracy: number;
  readonly verticalAccuracy: number;
  readonly timestamp: string;
}
