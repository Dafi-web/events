import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DafiTech homepage', () => {
  render(<App />);
  const dafiTechElement = screen.getByText(/DafiTech/i);
  expect(dafiTechElement).toBeInTheDocument();
});
