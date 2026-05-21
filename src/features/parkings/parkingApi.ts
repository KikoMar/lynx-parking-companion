import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ParkingStructure, RawGhentParkingResponse } from './parkingTypes';
import { mapRawRecordsToParkings } from './parkingMapper';
import {
  GHENT_PARKING_API_URL,
  PARKINGS_QUERY_KEY,
  PARKING_QUERY_STALE_TIME,
  PARKING_QUERY_REFETCH_INTERVAL,
} from '../../constants';

export { PARKINGS_QUERY_KEY };

export const fetchParkings = async (): Promise<ParkingStructure[]> => {
  const response = await axios.get<RawGhentParkingResponse>(GHENT_PARKING_API_URL);
  return mapRawRecordsToParkings(response.data?.records);
};

export const useParkingsQuery = (): UseQueryResult<
  ParkingStructure[],
  Error
> => {
  return useQuery<ParkingStructure[], Error>(
    PARKINGS_QUERY_KEY,
    fetchParkings,
    {
      staleTime: PARKING_QUERY_STALE_TIME,
      refetchInterval: PARKING_QUERY_REFETCH_INTERVAL,
      refetchOnWindowFocus: false,
    }
  );
};
