import { ParkingSortOption, ParkingStructure } from './parkingTypes';

export const filterParkingsByName = (
  parkings: ParkingStructure[],
  search: string
): ParkingStructure[] => {
  const term = search.trim().toLowerCase();
  if (!term) return parkings;
  return parkings.filter((p) => p.name.toLowerCase().includes(term));
};

export const sortParkings = (
  parkings: ParkingStructure[],
  sort: ParkingSortOption
): ParkingStructure[] => {
  const copy = [...parkings];
  switch (sort) {
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case 'spaces-asc':
      return copy.sort((a, b) => a.availableSpaces - b.availableSpaces);
    case 'spaces-desc':
      return copy.sort((a, b) => b.availableSpaces - a.availableSpaces);
    default:
      return copy;
  }
};

export const pinFavoriteFirst = (
  parkings: ParkingStructure[],
  favoriteId: string | null
): ParkingStructure[] => {
  if (!favoriteId) return parkings;
  const favorite = parkings.find((p) => p.id === favoriteId);
  if (!favorite) return parkings;
  return [favorite, ...parkings.filter((p) => p.id !== favoriteId)];
};

export const preparedParkingList = (
  parkings: ParkingStructure[],
  search: string,
  sort: ParkingSortOption,
  favoriteId: string | null
): ParkingStructure[] => {
  const filtered = filterParkingsByName(parkings, search);
  const sorted = sortParkings(filtered, sort);
  return pinFavoriteFirst(sorted, favoriteId);
};
