import { findByRole, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MessagesBox from './MessagesBox';
import '../../../../../../matchMedia';
describe('MessagingBox Component Tests', () => {
  test('Test MessagesBox Component', () => {
    render(<MessagesBox />);
    expect(screen.getByRole('button')).toHaveTextContent('View & Send Messages');
    expect(screen.getByText('View & Send Messages')).toBeInTheDocument();
    userEvent.click(screen.getByText('View & Send Messages'));
  });

  test('Test if... View & Send Messages button is visible', () => {
    render(<MessagesBox />);
    const button = screen.getByText('View & Send Messages');
    expect(button).toBeVisible();
  });

  test('Messaging Modal Opens', async () => {
    const { queryByText } = render(<MessagesBox />);
    userEvent.click(queryByText('View & Send Messages'));
    await waitFor(() => expect(screen.getByText(/Sending Message to/)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Sending Message to/)).toBeVisible());
    await waitFor(() => expect(screen.getByText('Send Message')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Send Message')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Cancel')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Cancel')).toBeVisible());
    await waitFor(() => expect(screen.getByText(/Type your message below/)).toBeInTheDocument());
  });
});
