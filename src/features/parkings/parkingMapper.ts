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
  const fields = record.fields ?? {};
  const locationAndDim = safeParseLocation(fields.locationanddimension);
  const coords = locationAndDim.coordinatesForDisplay;

  const latitude =
    typeof coords?.latitude === 'number'
      ? coords.latitude
      : Array.isArray(fields.location)
      ? fields.location[0]
      : null;
  const longitude =
    typeof coords?.longitude === 'number'
      ? coords.longitude
      : Array.isArray(fields.location)
      ? fields.location[1]
      : null;

  const isTemporaryClosed = Boolean(fields.temporaryclosed);
  const isOpen = Boolean(fields.isopennow) && !isTemporaryClosed;

  return {
    id: record.recordid,
    name: fields.name?.trim() || 'Unknown parking',
    description: fields.description?.trim() || '',
    address: cleanAddress(locationAndDim.roadName),
    openingHours: fields.openingtimesdescription?.trim() || 'Unknown',
    website: fields.urllinkaddress?.trim() || '',
    operator: fields.operatorinformation?.trim() || 'Unknown',
    category: fields.categorie?.trim() || 'Unknown',
    type: fields.type?.trim() || 'Unknown',
    isOpen,
    temporaryClosed: isTemporaryClosed,
    availableSpaces:
      typeof fields.availablecapacity === 'number' ? fields.availablecapacity : 0,
    totalCapacity: typeof fields.totalcapacity === 'number' ? fields.totalcapacity : 0,
    occupationPct: typeof fields.occupation === 'number' ? fields.occupation : 0,
    latitude,
    longitude,
    lastUpdate: fields.lastupdate ?? '',
    extraInfo: fields.text?.trim() || '',
  };
};

export const mapRawRecordsToParkings = (
  records: RawGhentParkingRecord[] | undefined
): ParkingStructure[] => {
  if (!Array.isArray(records)) return [];
  return records.map(mapRawRecordToParking);
};
