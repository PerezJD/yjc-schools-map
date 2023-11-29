export enum Borough {
  MANHATTAN='manhattan',
  BROOKLYN='brooklyn',
  QUEENS='queens',
  BRONX='bronx',
  THE_BRONX='the bronx',
  STATEN_ISLAND='staten island',
  SI='si'
}

export interface School {
  name: string;
  publication: string;
  link: string;
  address: string;
  borough: Borough;
  position: {
    lat: number;
    lng: number;
  }
}

export interface SchoolMarker extends School {
  marker: any;
}

export const BOROUGH_DISPLAY_NAME = {
  [Borough.MANHATTAN]: 'Manhattan',
  [Borough.BROOKLYN]: 'Brooklyn',
  [Borough.QUEENS]: 'Queens',
  [Borough.BRONX]: 'The Bronx',
  [Borough.THE_BRONX]: 'The Bronx',
  [Borough.SI]: 'Staten Island',
  [Borough.STATEN_ISLAND]: 'Staten Island'
}

export const BOROUGH_POSITIONS = {
  [Borough.MANHATTAN]: {
    lat: 40.782912242718,
    lng: -73.96605840292472
  },
  [Borough.BROOKLYN]: {
    lat: 40.6781784,
    lng: -73.9441579
  },
  [Borough.QUEENS]: {
    lat: 40.71911081378945,
    lng: -73.8176461921227
  },
  [Borough.BRONX]: {
    lat: 40.858121761198916,
    lng: -73.87466113394659
  },
  [Borough.THE_BRONX]: {
    lat: 40.858121761198916,
    lng: -73.87466113394659
  },
  [Borough.SI]: {
    lat: 40.58126629597513,
    lng: -74.16021123439997
  },
  [Borough.STATEN_ISLAND]: {
    lat: 40.58126629597513,
    lng: -74.16021123439997
  }
}
