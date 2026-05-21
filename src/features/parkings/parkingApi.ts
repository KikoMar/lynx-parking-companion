import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ParkingStructure, RawGhentParkingResponse } from './parkingTypes';
import { mapRawRecordsToParkings } from './parkingMapper';
import { GHENT_PARKING_API_URL } from '../../constants';

export const fetchParkings = async (): Promise<ParkingStructure[]> => {
  const response = await axios.get<RawGhentParkingResponse>(GHENT_PARKING_API_URL);
  return mapRawRecordsToParkings(response.data?.records);
};

export const useParkingsQuery = (): UseQueryResult<ParkingStructure[], Error> => {
  return useQuery<ParkingStructure[], Error>(
    ['parkings'],
    fetchParkings,
    {
      staleTime: 60_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
    }
  );
};
