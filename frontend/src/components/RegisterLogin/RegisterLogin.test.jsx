import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import RegisterLogin from "../RegisterLogin/RegisterLogin.jsx";
import "@testing-library/jest-dom";


// Mocking axios and useNavigate
jest.spyOn(window, 'alert').mockImplementation(() => {});
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: '?form=login',
  }),
}));


describe('LogoComponent', () => {
  const mockStyles = {
    container: 'container-class',
    content: 'content-class',
    logo: 'logo-class',
  };
  const mockLogo = 'test-logo.png';

  test('renders the logo with correct attributes', () => {
    render(
      <div className={mockStyles.container}>
        <div className={mockStyles.content}>
          <img src={mockLogo} alt="This is our logo" className={mockStyles.logo} />
        </div>
      </div>
    );

    const logoImage = screen.getByAltText('This is our logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', mockLogo);
    expect(logoImage).toHaveClass(mockStyles.logo);
  });
});



describe('Login Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
    axios.get.mockResolvedValue({
      data: { valid: false },
    });
  });

  
  //done 
   test('renders login form initially when form query is set to login', () => {
    render(
      <BrowserRouter>
        <RegisterLogin />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });


  test('toggles between login and sign-up forms when links are clicked', async () => {
    render(
      <BrowserRouter>
        <RegisterLogin />
      </BrowserRouter>
    );
  });

  //done
  test('logs in a user with correct credentials', async () => {
    axios.post.mockResolvedValueOnce({
      data: { isLoggedIn: true, status: 'Active', role: 'Student' },
    });
  
    render(
      <BrowserRouter>
        <RegisterLogin />
      </BrowserRouter>
    );
  
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'dcs.john.doe@cvsu.edu.ph' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });
  
    // Trigger the form submission
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
  
    // Add a waitFor block to ensure asynchronous code completes
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
        loginEmail: 'dcs.john.doe@cvsu.edu.ph',
        loginPass: 'password123',
      });
    });
  });


  // Test for failed login scenario
test('fails to log in with incorrect credentials', async () => {
  // Mock failed login response
  axios.post.mockResolvedValueOnce({
    data: { isLoggedIn: false, message: 'Invalid credentials' },
  });

  render(
    <BrowserRouter>
      <RegisterLogin />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Enter email'), {
    target: { value: 'dcs.john.doe@cvsu.edu.ph' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter password'), {
    target: { value: 'wrongpassword' },
  });

  // Trigger the form submission
  fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

  // Wait for the axios call to complete
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
      loginEmail: 'dcs.john.doe@cvsu.edu.ph',
      loginPass: 'wrongpassword',
    });
  });

  // Verify the failure behavior (alert in this case)
  // You can use a spy on the window.alert function if you're expecting an alert
  jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert

  // Check if alert was called with the expected failure message
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });
});







});


