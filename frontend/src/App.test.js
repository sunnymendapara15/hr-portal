import { render, screen } from '@testing-library/react';
import App from './App';

describe('App shell', () => {
  it('renders the HR Portal header', () => {
    render(<App />);
    expect(screen.getByText(/HR Portal/i)).toBeInTheDocument();
  });
});
