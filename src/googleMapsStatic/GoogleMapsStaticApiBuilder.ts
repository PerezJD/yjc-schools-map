import {Coordinate, ImageFormat, MapStyle, MapType, Marker, MarkerStyle} from "./models";

export default class GoogleMapsStaticApiBuilder {

  static readonly #BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap';

  // Location parameters
  #center?: Coordinate;
  #zoom = 1;
  #size = '500x400';

  // Map parameters
  #scale?: number;
  #format?: ImageFormat;
  #maptype?: MapType;
  #language?: string;
  #region?: string;

  // Feature parameters
  #mapId?: string;
  #markers?: Marker[];
  #markerStyle?: MarkerStyle;
  #path?: string;
  #visible?: string;
  #style?: MapStyle[];

  set center(center: Coordinate) {
    this.#center = center;
  }

  set zoom(zoom: number) {
    this.#zoom = zoom;
  }

  set size(size: string) {
    this.#size = size;
  }

  set scale(scale: number) {
    this.#scale = scale;
  }

  set format(format: ImageFormat) {
    this.#format = format;
  }

  set maptype(maptype: MapType) {
    this.#maptype = maptype;
  }

  set language(language: string) {
    this.#language = language;
  }

  set region(region: string) {
    this.#region = region;
  }

  set mapId(mapId: string) {
    this.#mapId = mapId;
  }

  set markers(markers: Marker[]) {
    this.#markers = markers;
  }

  set markerStyle(markerStyle: MarkerStyle) {
    this.#markerStyle = markerStyle;
  }

  set path(path: string) {
    this.#path = path;
  }

  set visible(visible: string) {
    this.#visible = visible;
  }

  set style(style: MapStyle[]) {
    this.#style = style;
  }

  addMarker(marker: Marker) {
    if (!this.#markers?.length) this.#markers = [];
    this.#markers!.push(marker);
  }

  build(): string {
    const params = new URLSearchParams();

    if (!this.#markers?.length) {
      if (!this.#center) {
        throw 'Center is required if no markers are set';
      }

      if(!this.#zoom) {
        throw 'Zoom is required if no markers are set';
      }
    }

    if (this.#center) {
      params.set('center', `${this.#center.lat},${this.#center.lng}`);
    }

    if (this.#zoom) params.set('zoom', `${this.#zoom}`);
    if (this.#size) params.set('size', this.#size);
    if (this.#scale) params.set('scale', `${this.#scale}`);
    if (this.#format) params.set('format', this.#format);
    if (this.#maptype) params.set('maptype', this.#maptype);
    if (this.#language) params.set('language', this.#language);
    if (this.#region) params.set('region', this.#region);

    if (this.#mapId) params.set('map_id', this.#mapId);
    if (this.#path) params.set('path', this.#path);
    if (this.#visible) params.set('visible', this.#visible);

    if (this.#style?.length) {
      this.#style.forEach((style) => {
        params.append('style', GoogleMapsStaticApiBuilder.#toStyleString(style));
      });
    }

    if (this.#markers?.length) {
      let markers = '';
      if (this.#markerStyle) {
        const { color, size } = this.#markerStyle;
        markers = `${color ? `color:${color.replace('#', '0x')}|` : ''}${size ? `size:${size}|` : ''}`;
      }

      markers += this.#markers.map((marker) => {
        const { position } = marker;
        return `${position.lat},${position.lng}`;
      }).join('|');

      params.append('markers', markers);
    }

    return `${GoogleMapsStaticApiBuilder.#BASE_URL}?${params.toString()}`;
  }

  static #toStyleString(style: MapStyle): string {
    const { featureType, elementType, stylers } = style;
    const rules = stylers.reduce((rules: string[], styler) => {
      let [k, v] = Object.entries(styler)[0];
      if (k === 'color') {
        v = (v as string).replace('#', '0x');
      }

      rules.push(`${k}:${v}`);
      return rules;
    }, []).join('|');

    return `feature:${featureType}${elementType ? `|element:${elementType}|` : '|'}${rules}`;
  }
}
