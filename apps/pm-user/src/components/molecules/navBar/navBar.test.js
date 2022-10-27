import { findByRole, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NavBar from './NavBar';
import '../../../../../../matchMedia';
describe('NavBar Component Tests', () => {
  test('Logo Text checking...', () => {
    render(<NavBar />);
    expect(screen.getByText('Pesto Matrimony')).toBeInTheDocument();
    expect(screen.getByText('Pesto Matrimony')).toBeVisible();
  });
});
