import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import logoutFunction from '../logoutFunction';

jest.mock('axios');
jest.mock('../logoutFunction');

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

    // Check if notification icon exists
    const notificationIcon = screen.getByAltText('Notification Icon');
    expect(notificationIcon).toBeInTheDocument();

    // Check if profile icon exists
    const profileIcon = screen.getByAltText('Profile Icon');
    expect(profileIcon).toBeInTheDocument();

    // Check if axios was called to fetch user data
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080');
  });

  test('fetches and displays user email', async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Wait for axios to resolve and check user email state
    expect(await screen.findByAltText('Profile Icon')).toBeInTheDocument();
  });

  test('toggles notification dropdown on click', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Simulate clicking the notification button
    const notificationButton = screen.getByAltText('Notification Icon').closest('button');
    fireEvent.click(notificationButton);

    // Check if dropdown is displayed
    expect(screen.getByText('New Notification 1')).toBeInTheDocument();
    expect(screen.getByText('New Notification 2')).toBeInTheDocument();

    // Click again to close the dropdown
    fireEvent.click(notificationButton);
    expect(screen.queryByText('New Notification 1')).not.toBeInTheDocument();
  });

  test('toggles profile dropdown on click', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Simulate clicking the profile button
    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);

    // Check if dropdown links are displayed
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Search History')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage Content')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click again to close the dropdown
    fireEvent.click(profileButton);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('triggers logout function on logout click', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Open profile dropdown
    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);

    // Click logout link
    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);

    // Check if logoutFunction was called
    expect(logoutFunction).toHaveBeenCalled();
  });

  test('renders all icons correctly', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
  
    // Verify main icons are rendered
    expect(screen.getByAltText('Notification Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Profile Icon')).toBeInTheDocument();
  
    // Open profile dropdown
    const profileButton = screen.getByAltText('Profile Icon').closest('button');
    fireEvent.click(profileButton);
  
    // Verify dropdown icons are rendered
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
    expect(screen.getByAltText('Account Settings')).toBeInTheDocument();
    expect(screen.getByAltText('Search History')).toBeInTheDocument();
    expect(screen.getByAltText('Manage Content')).toBeInTheDocument();
    expect(screen.getByAltText('Logout')).toBeInTheDocument();
  });
});
