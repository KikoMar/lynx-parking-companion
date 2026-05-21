import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import ParkingOverviewPage from '../features/parkings/ParkingOverviewPage';
import { useParkingStore } from '../features/parkings/parkingStore';
import { createTestQueryClient, mockParkings } from '../test/testUtils';

jest.mock('../features/parkings/parkingApi', () => {
  const utils = require('../test/testUtils');
  return {
    PARKINGS_QUERY_KEY: ['parkings'],
    fetchParkings: jest.fn(),
    useParkingsQuery: () => ({
      data: utils.mockParkings,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    }),
  };
});

const renderPage = () => {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/parkings']}>
        <ParkingOverviewPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  window.localStorage.clear();
  useParkingStore.setState({ favoriteParkingId: null });
});

test('Parking list search filters by name', async () => {
  const user = userEvent.setup({ delay: null });
  renderPage();

  // All 3 mock parkings visible
  expect(screen.getByText('Savaanstraat')).toBeInTheDocument();
  expect(screen.getByText('Reep')).toBeInTheDocument();
  expect(screen.getByText('Dok noord')).toBeInTheDocument();

  const search = screen.getByLabelText(/search parkings/i);
  await user.type(search, 'reep');

  await waitFor(() => {
    expect(screen.queryByText('Savaanstraat')).not.toBeInTheDocument();
  });
  expect(screen.queryByText('Dok noord')).not.toBeInTheDocument();
  expect(screen.getByText('Reep')).toBeInTheDocument();
});

// antd Select opens a portal dropdown; give it more room in the slow jsdom env
test('Sorting by available spaces (high → low) reorders the list', async () => {
  const user = userEvent.setup({ delay: null });
  renderPage();

  const sortSelect = screen.getByRole('combobox', { name: /sort parkings/i });
  await user.click(sortSelect);
  const option = await screen.findByText(/available spaces \(high → low\)/i);
  await user.click(option);

  await waitFor(() => {
    const cards = screen.getAllByTestId(/^parking-card-/);
    const names = cards.map((c) => within(c).getByRole('heading').textContent);
    // Expected order: Savaanstraat (327), Dok noord (298), Reep (23)
    expect(names).toEqual(['Savaanstraat', 'Dok noord', 'Reep']);
  });
}, 15000);

test('Favorite parking is pinned to the top of the list', async () => {
  const user = userEvent.setup({ delay: null });
  renderPage();

  // Default sort is name-asc; default order: Dok noord, Reep, Savaanstraat
  let cards = screen.getAllByTestId(/^parking-card-/);
  expect(
    within(cards[0]).getByRole('heading').textContent
  ).toBe('Dok noord');

  // Mark Reep as favorite
  await user.click(screen.getByTestId(`favorite-${mockParkings[1].id}`));

  await waitFor(() => {
    cards = screen.getAllByTestId(/^parking-card-/);
    expect(within(cards[0]).getByRole('heading').textContent).toBe('Reep');
  });
});
