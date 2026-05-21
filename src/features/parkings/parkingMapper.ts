import {
  ParkingStructure,
  RawGhentParkingRecord,
  RawGhentLocationAndDimension,
} from './parkingTypes';


const safeParseLocation = (
  raw: string | undefined
): RawGhentLocationAndDimension => {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RawGhentLocationAndDimension;
  } catch (e) {
    console.error('Failed to parse locationanddimension', e);
    return {};
  }
};

const cleanAddress = (address: string | undefined): string => {
  if (!address || address.trim() === '?' || address.trim() === '') {
    return 'Address not available';
  }
  return address.replace(/\s+/g, ' ').trim();
};

export const mapRawRecordToParking = (
  record: RawGhentParkingRecord
): ParkingStructure => {
  const f = record.fields ?? {};
  const locationAndDim = safeParseLocation(f.locationanddimension);
  const coords = locationAndDim.coordinatesForDisplay;

  const latitude =
    typeof coords?.latitude === 'number'
      ? coords.latitude
      : Array.isArray(f.location)
      ? f.location[0]
      : null;
  const longitude =
    typeof coords?.longitude === 'number'
      ? coords.longitude
      : Array.isArray(f.location)
      ? f.location[1]
      : null;

  const isTemporaryClosed = Boolean(f.temporaryclosed);
  const isOpen = Boolean(f.isopennow) && !isTemporaryClosed;

  return {
    id: record.recordid,
    name: f.name?.trim() || 'Unknown parking',
    description: f.description?.trim() || '',
    address: cleanAddress(locationAndDim.roadName),
    openingHours: f.openingtimesdescription?.trim() || 'Unknown',
    website: f.urllinkaddress?.trim() || '',
    operator: f.operatorinformation?.trim() || 'Unknown',
    category: f.categorie?.trim() || 'Unknown',
    type: f.type?.trim() || 'Unknown',
    isOpen,
    temporaryClosed: isTemporaryClosed,
    availableSpaces:
      typeof f.availablecapacity === 'number' ? f.availablecapacity : 0,
    totalCapacity: typeof f.totalcapacity === 'number' ? f.totalcapacity : 0,
    occupationPct: typeof f.occupation === 'number' ? f.occupation : 0,
    latitude,
    longitude,
    lastUpdate: f.lastupdate ?? '',
    extraInfo: f.text?.trim() || '',
  };
};

export const mapRawRecordsToParkings = (
  records: RawGhentParkingRecord[] | undefined
): ParkingStructure[] => {
  if (!Array.isArray(records)) return [];
  return records.map(mapRawRecordToParking);
};
