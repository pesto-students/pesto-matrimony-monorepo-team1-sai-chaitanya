import { findByRole, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchProfiles from './SearchProfiles';
import '../../../../../../matchMedia';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true, accessToken: { claims: { uid: 'oktaIdOfLoggedInUser' } } },
    authService: { handleAuthentication: jest.fn() },
  }),
}));
describe('SearchProfiles Component Tests', () => {
  test('Checking if all fields & button are present and visible...', () => {
    render(<SearchProfiles />);
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeVisible();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Religion')).toBeInTheDocument();
    expect(screen.getByText('Religion')).toBeVisible();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeVisible();
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeVisible();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeVisible();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeVisible();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeVisible();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Search');
    expect(screen.getByRole('button')).toBeVisible();
  });
});
