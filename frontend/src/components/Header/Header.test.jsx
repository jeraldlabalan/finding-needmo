import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import logoutFunction from '../logoutFunction';

jest.mock('axios');
jest.mock('../logoutFunction');

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { valid: true, email: 'test@example.com' } });
  });

  test('renders header with notification and profile icons', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

 

    const profileIcon = screen.getByAltText('Profile Icon');
    expect(profileIcon).toBeInTheDocument();

       expect(axios.get).toHaveBeenCalledWith('http://localhost:8080');
  });

  test('fetches and displays user email', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );


    expect(await screen.findByAltText('Profile Icon')).toBeInTheDocument();
  });

  

  test('toggles profile dropdown on click', () => {
    render(
      <Router>
        <Header />
      </Router>
    );


    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Search History')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('triggers logout function on logout click', () => {
    render(
      <Router>
        <Header />
      </Router>
    );


    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);

    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);


    expect(logoutFunction).toHaveBeenCalled();
  });

  test('renders all icons correctly', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
  


    expect(screen.getByAltText('Profile Icon')).toBeInTheDocument();
  

    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);
  

    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByAltText('Account Settings')).toBeInTheDocument();
    expect(screen.getByAltText('Search History')).toBeInTheDocument();
    expect(screen.getByAltText('Logout')).toBeInTheDocument();
  });
});
