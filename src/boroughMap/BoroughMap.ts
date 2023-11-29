import GoogleMapsStaticApiBuilder from "../googleMapsStatic/GoogleMapsStaticApiBuilder";
import GoogleSheetsQuery from "../googleSheetQuery/GoogleSheetsQuery";
import LocalCache from "../cache/LocalCache";
import {MapStyle, Marker} from "../googleMapsStatic/models";
import {Borough} from "../models";

export default class BoroughMap {

  static readonly BOROUGH_MAP_ELEMENT_CLASS = 'yjc-borough-school-map';
  static readonly BOROUGH_ATTR = 'data-borough';

  static readonly #BOROUGH_MARKER_STYLE = {
    color: '#FFC700'
  };

  static readonly #BOROUGH_MAP_STYLE: MapStyle[] = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#444444"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f4f4f3"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        },
        {
          "saturation": "0"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffc700"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "saturation": "0"
        },
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "visibility": "on"
        }
      ]
    }
  ];

  readonly #borough: Borough;
  readonly #googleMapsBuilder: GoogleMapsStaticApiBuilder;
  readonly #googleSheetQuery: GoogleSheetsQuery;
  readonly #cache: LocalCache;

  constructor(borough: Borough, cache: LocalCache, googleSheetQuery: GoogleSheetsQuery) {
    this.#borough = borough;
    this.#googleMapsBuilder = new GoogleMapsStaticApiBuilder();
    this.#googleSheetQuery = googleSheetQuery;
    this.#cache = cache;
  }

  async buildStaticMap(): Promise<string | undefined> {
    const cachedMapUrl = this.#cache.get(this.#borough);
    if (cachedMapUrl) {
      console.info(`Map URL retrieved from cache ${this.#borough}`);
      return cachedMapUrl;
    }

    // Allow it to set zoom automatically and set style
    this.#googleMapsBuilder.zoom = 0;
    this.#googleMapsBuilder.size = '748x421';
    this.#googleMapsBuilder.style = BoroughMap.#BOROUGH_MAP_STYLE;
    this.#googleMapsBuilder.markerStyle = BoroughMap.#BOROUGH_MARKER_STYLE;

    const schools = await this.#querySchoolsByBorough();
    if (!schools) {
      console.error(`No schools found for borough: ${this.#borough}`);
      return;
    }

    schools.forEach((school: Marker) => {
      this.#googleMapsBuilder.addMarker(school);
    });

    // Generate the map url, cache it, and return
    const staticMapsApiUrl = this.#googleMapsBuilder.build();
    this.#cache.set(this.#borough, staticMapsApiUrl);
    return staticMapsApiUrl;
  }

  async #querySchoolsByBorough() {
    const query = `Select A,G WHERE F = "${this.#borough}"`;
    const rows = await this.#googleSheetQuery.querySheet(query);

    return rows.reduce((results: Marker[], row: any) => {
      const coordinate = row.c[1].v;

      if (coordinate !== '#ERROR!') {
        const coordinates = coordinate.split(', ');
        results.push({
          position: {
            lat: Number(coordinates[0]),
            lng: Number(coordinates[1])
          }
        })
      }

      return results;
    }, []);
  }
}
