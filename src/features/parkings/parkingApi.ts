import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ParkingStructure, RawGhentParkingResponse } from './parkingTypes';
import { mapRawRecordsToParkings } from './parkingMapper';

const GHENT_PARKING_URL =
  'https://data.stad.gent/api/records/1.0/search/?dataset=bezetting-parkeergarages-real-time&q=&rows=50';

export const fetchParkings = async (): Promise<ParkingStructure[]> => {
  const response = await axios.get<RawGhentParkingResponse>(GHENT_PARKING_URL);
  return mapRawRecordsToParkings(response.data?.records);
};

export const PARKINGS_QUERY_KEY = ['parkings'] as const;

export const useParkingsQuery = (): UseQueryResult<
  ParkingStructure[],
  Error
> => {
  return useQuery<ParkingStructure[], Error>(
    PARKINGS_QUERY_KEY,
    fetchParkings,
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
};
