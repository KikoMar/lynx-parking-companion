import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ParkingStructure } from '../features/parkings/parkingTypes';

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: Infinity,
      },
    },
  });

export const renderWithProviders = (
  ui: React.ReactElement,
  { initialEntries = ['/'], ...options }: { initialEntries?: string[] } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  const client = createTestQueryClient();
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
    ...options,
  });
};

export const mockParkings: ParkingStructure[] = [
  {
    id: 'p-1',
    name: 'Savaanstraat',
    description: 'Underground garage Savaanstraat',
    address: 'Savaanstraat 13, 9000 Gent',
    openingHours: '24/7',
    website: 'https://example.com/savaanstraat',
    operator: 'Mobiliteitsbedrijf Gent',
    category: 'parking in LEZ',
    type: 'carPark',
    isOpen: true,
    temporaryClosed: false,
    availableSpaces: 327,
    totalCapacity: 510,
    occupationPct: 35,
    latitude: 51.04877,
    longitude: 3.72346,
    lastUpdate: '2026-05-21T19:18:55+02:00',
    extraInfo: '',
  },
  {
    id: 'p-2',
    name: 'Reep',
    description: 'Garage Reep',
    address: 'Seminariestraat 9, 9000 Gent',
    openingHours: '24/7',
    website: 'https://example.com/reep',
    operator: 'Mobiliteitsbedrijf Gent',
    category: 'parking in LEZ',
    type: 'carPark',
    isOpen: true,
    temporaryClosed: false,
    availableSpaces: 23,
    totalCapacity: 458,
    occupationPct: 94,
    latitude: 51.05215,
    longitude: 3.72989,
    lastUpdate: '2026-05-21T19:18:55+02:00',
    extraInfo: '',
  },
  {
    id: 'p-3',
    name: 'Dok noord',
    description: 'Garage Dok noord',
    address: 'Dok noord, 9000 Gent',
    openingHours: '24/7',
    website: 'https://example.com/dok',
    operator: 'Indigo',
    category: 'parking buiten LEZ',
    type: 'offStreetParkingGround',
    isOpen: true,
    temporaryClosed: false,
    availableSpaces: 298,
    totalCapacity: 550,
    occupationPct: 45,
    latitude: 51.06568,
    longitude: 3.73283,
    lastUpdate: '2026-05-21T19:18:55+02:00',
    extraInfo: '',
  },
];
