export enum AppRoute {
  root = '/',
  setup = '/setup',
  parkings = '/parkings',
  parkingDetail = '/parkings/:parkingId',
  profile = '/profile',
}

export const GHENT_PARKING_API_URL =
  'https://data.stad.gent/api/records/1.0/search/?dataset=bezetting-parkeergarages-real-time&q=&rows=50';


