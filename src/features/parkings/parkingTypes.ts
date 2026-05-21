export interface RawGhentLocationAndDimension {
  specificAccessInformation?: string[];
  level?: string;
  roadNumber?: string;
  roadName?: string;
  contactDetailsTelephoneNumber?: string;
  coordinatesForDisplay?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface RawGhentParkingFields {
  name?: string;
  description?: string;
  openingtimesdescription?: string;
  urllinkaddress?: string;
  operatorinformation?: string;
  categorie?: string;
  type?: string;
  freeparking?: number;
  occupation?: number;
  availablecapacity?: number;
  totalcapacity?: number;
  temporaryclosed?: number;
  isopennow?: number;
  lastupdate?: string;
  locationanddimension?: string;
  location?: [number, number];
  text?: string;
}

export interface RawGhentParkingRecord {
  recordid: string;
  datasetid?: string;
  fields: RawGhentParkingFields;
  geometry?: {
    type: string;
    coordinates: [number, number];
  };
  record_timestamp?: string;
}

export interface RawGhentParkingResponse {
  nhits: number;
  records: RawGhentParkingRecord[];
}

export interface ParkingStructure {
  id: string;
  name: string;
  description: string;
  address: string;
  openingHours: string;
  website: string;
  operator: string;
  category: string;
  type: string;
  isOpen: boolean;
  temporaryClosed: boolean;
  availableSpaces: number;
  totalCapacity: number;
  occupationPct: number;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string;
  extraInfo: string;
}

export type ParkingSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'spaces-asc'
  | 'spaces-desc';
