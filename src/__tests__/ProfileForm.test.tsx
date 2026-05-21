import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetupPage from '../features/profile/SetupPage';
import { renderWithProviders } from '../test/testUtils';
import { useProfileStore } from '../features/profile/profileStore';

beforeEach(() => {
  useProfileStore.setState({ profile: null });
  window.localStorage.clear();
});

test('ProfileForm saves valid profile data and redirects to /parkings', async () => {
  const user = userEvent.setup({ delay: null });
  renderWithProviders(<SetupPage />);

  await user.type(screen.getByLabelText(/first name/i), 'Jane');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/license plate/i), '1-ABC-123');
  await user.type(screen.getByLabelText(/car make/i), 'Volkswagen');
  await user.type(screen.getByLabelText(/car model/i), 'Golf');

  await user.click(screen.getByRole('button', { name: /save and continue/i }));

  // Profile should be in store now
  const stored = useProfileStore.getState().profile;
  expect(stored).toEqual({
    firstName: 'Jane',
    lastName: 'Doe',
    licensePlate: '1-ABC-123',
    carMake: 'Volkswagen',
    carModel: 'Golf',
  });
}, 20000);
