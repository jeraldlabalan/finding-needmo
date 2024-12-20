import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders the Footer component', () => {
    render(<Footer />);
    const footerElement = screen.getByText(/Footer/i);
    expect(footerElement).toBeInTheDocument();
  });
});
