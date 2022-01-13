export interface NotificareRegion {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly referenceKey?: string;
  readonly geometry: NotificareRegionGeometry;
  readonly advancedGeometry?: NotificareRegionAdvancedGeometry;
  readonly major?: number;
  readonly distance: number;
  readonly timeZone: string;
  readonly timeZonOffset: number;
}

export interface NotificareRegionGeometry {
  readonly type: string;
  readonly coordinate: NotificareRegionCoordinate;
}

export interface NotificareRegionAdvancedGeometry {
  readonly type: string;
  readonly coordinates: NotificareRegionCoordinate[];
}

export interface NotificareRegionCoordinate {
  readonly latitude: number;
  readonly longitude: number;
}
