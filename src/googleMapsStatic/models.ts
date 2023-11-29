export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Marker {
  position: Coordinate;
}

export interface MarkerStyle {
  size?: 'tiny' | 'mid' | 'small';
  color?: string;
}

export enum ImageFormat {
  PNG='png',
  PNG32='png32',
  GIF='gif',
  JPG='jpg',
  JPG_BASELINE='jpg-baseline'
}

export enum MapType {
  roadmap='roadmap',
  satellite='satellite',
  terrain='terrain',
  hybrid='hybrid'
}

export interface MapStyle {
  featureType: string;
  elementType: string;
  stylers: Record<string, string | number>[];
}
