export enum AppRoute {
  root = '/',
  setup = '/setup',
  parkings = '/parkings',
  parkingDetail = '/parkings/:parkingId',
  profile = '/profile',
}

export const GHENT_PARKING_API_URL =
  'https://data.stad.gent/api/records/1.0/search/?dataset=bezetting-parkeergarages-real-time&q=&rows=50';

export const PARKINGS_QUERY_KEY = ['parkings'] as const;

export const PARKING_QUERY_STALE_TIME = 60 * 1000;
export const PARKING_QUERY_REFETCH_INTERVAL = 60 * 1000;
export const QUERY_RETRY_COUNT = 1;


