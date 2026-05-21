import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../app/routes';
import { useProfileStore } from '../features/profile/profileStore';
import { createTestQueryClient, mockParkings } from '../test/testUtils';

jest.mock('../features/parkings/parkingApi', () => {
  const utils = require('../test/testUtils');
  return {
    fetchParkings: jest.fn(),
    useParkingsQuery: () => ({
      data: utils.mockParkings,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    }),
  };
});

beforeEach(() => {
  window.localStorage.clear();
});

const renderRoutes = (initialEntries: string[]) => {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

test('App skips setup when profile exists in store', async () => {
  useProfileStore.setState({
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      licensePlate: '1-ABC-123',
      carMake: 'VW',
      carModel: 'Golf',
    },
  });

  renderRoutes(['/']);

  await waitFor(() => {
    expect(screen.getByTestId('parking-overview')).toBeInTheDocument();
  });
  expect(screen.getByText(mockParkings[0].name)).toBeInTheDocument();
});

test('App shows setup when no profile exists', async () => {
  useProfileStore.setState({ profile: null });

  renderRoutes(['/']);

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /welcome to lynx parking/i })
    ).toBeInTheDocument();
  });
});
