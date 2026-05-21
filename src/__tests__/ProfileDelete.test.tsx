import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../app/routes';
import { useProfileStore } from '../features/profile/profileStore';
import { useParkingStore } from '../features/parkings/parkingStore';
import { createTestQueryClient } from '../test/testUtils';

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
  useProfileStore.setState({
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      licensePlate: '1-ABC-123',
      carMake: 'VW',
      carModel: 'Golf',
    },
  });
  useParkingStore.setState({ favoriteParkingId: 'p-1' });
});

test('Deleting profile clears profile and redirects to /setup', async () => {
  const user = userEvent.setup({ delay: null });
  const client = createTestQueryClient();

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // On profile page
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /your profile/i })
    ).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /delete profile/i }));
  // Confirm in popconfirm
  const confirmBtn = await screen.findByRole('button', { name: /^delete$/i });
  await user.click(confirmBtn);

  // Profile cleared
  await waitFor(() => {
    expect(useProfileStore.getState().profile).toBeNull();
  });
  expect(useParkingStore.getState().favoriteParkingId).toBeNull();

  // Redirected to setup page
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /welcome to lynx parking/i })
    ).toBeInTheDocument();
  });
}, 20000);
