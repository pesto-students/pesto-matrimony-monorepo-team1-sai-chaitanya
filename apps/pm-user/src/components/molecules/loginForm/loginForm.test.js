import { findByRole, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import '../../../../../../matchMedia';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: false },
    authService: { handleAuthentication: jest.fn() },
  }),
}));

test('Test LoginForm Component', () => {
  render(<LoginForm />);
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeVisible();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Login');
});
