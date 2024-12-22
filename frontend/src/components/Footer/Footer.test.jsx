import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Unit Testing for the Footer Component', () => {
  test('Renders the Footer component', () => {
    render(<Footer />);
    const footerElement = screen.getByText(/Footer/i);
    expect(footerElement).toBeInTheDocument();
  });
});
