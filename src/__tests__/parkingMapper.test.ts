import { mapRawRecordToParking, mapRawRecordsToParkings } from '../features/parkings/parkingMapper';
import { RawGhentParkingRecord } from '../features/parkings/parkingTypes';

const baseRecord: RawGhentParkingRecord = {
  recordid: 'test-123',
  fields: {
    name: 'Test Parking',
    availablecapacity: 50,
    totalcapacity: 100,
    isopennow: 1,
    temporaryclosed: 0,
  },
};

test('maps basic fields correctly', () => {
  const result = mapRawRecordToParking(baseRecord);
  expect(result.id).toBe('test-123');
  expect(result.name).toBe('Test Parking');
  expect(result.availableSpaces).toBe(50);
  expect(result.totalCapacity).toBe(100);
  expect(result.isOpen).toBe(true);
});

test('falls back to "Address not available" when roadName is "?"', () => {
  const record: RawGhentParkingRecord = {
    ...baseRecord,
    fields: {
      ...baseRecord.fields,
      locationanddimension: JSON.stringify({ roadName: '?' }),
    },
  };
  expect(mapRawRecordToParking(record).address).toBe('Address not available');
});

test('returns empty array when records is undefined', () => {
  expect(mapRawRecordsToParkings(undefined)).toEqual([]);
});

test('does not throw on malformed locationanddimension JSON', () => {
  const record: RawGhentParkingRecord = {
    ...baseRecord,
    fields: { ...baseRecord.fields, locationanddimension: '{bad json' },
  };
  expect(() => mapRawRecordToParking(record)).not.toThrow();
});
