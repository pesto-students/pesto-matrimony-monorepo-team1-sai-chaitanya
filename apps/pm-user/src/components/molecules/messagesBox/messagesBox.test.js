import { findByRole, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MessagesBox from './MessagesBox';
import '../../../../../../matchMedia';

test('Test MessagesBox Component', () => {
  render(<MessagesBox />);
  expect(screen.getByText('Login to your acccount!')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Submit');
});
