import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AccountSettings from './AccountSettings'; 

jest.mock('../../assets/account-settings-icon.png', () => 'account-settings-icon.png');
jest.mock('../../assets/account-settings-icon.png', () => 'account-setting-icon.png');
jest.mock('../../assets/email-icon-white.png', () => 'email-icon-white.png');
jest.mock('../../assets/verify-icon-black.png', () => 'verify-icon-black.png');
jest.mock('../../assets/email.png', () => 'email.png');
jest.mock('../../assets/verified_icon.png', () => 'verified_icon.png');

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});

describe('AccountSettings', () => {
 
  test('renders account settings page', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );
  
    // account setting page
    expect(screen.getByText('account settings')).toBeInTheDocument();
    expect(screen.getByText('change your email')).toBeInTheDocument();
    expect(screen.getByText('change your password')).toBeInTheDocument();
    expect(screen.getByText('Change your email and we’ll send an OTP.')).toBeInTheDocument();
    expect(screen.getByText('Change your password and we’ll send an OTP.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'account setting icon' })).toBeInTheDocument();
  });

  // if user choose change email
  test('navigates to change email form', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    const changeEmailButton = screen.getByText('change your email');
    fireEvent.click(changeEmailButton);

    // if we are in the email change form (step 1)
    expect(screen.getByText('verify your password')).toBeInTheDocument();
    expect(screen.getByText('Re-enter your Finding NeedMo password to continue.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });


  test('click next in change email form step 1 and render step 2', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your email')); // Open change email form
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); // Simulate typing password
    fireEvent.click(screen.getByText('next')); // Go to next step


    expect(screen.getByText('next')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });


  test('click next in change email form step 2 and navigates to success screen', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );
  
    fireEvent.click(screen.getByText('change your email'));
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('next'));

  });
  

  test('navigates to change password form', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    const changePasswordButton = screen.getByText('change your password');
    fireEvent.click(changePasswordButton);


    expect(screen.getByText('verify your password')).toBeInTheDocument();
    expect(screen.getByText('Re-enter your Finding NeedMo password to continue.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });


  test('click next in change password form step 1 and render step 2', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your password')); 
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); 
    fireEvent.click(screen.getByText('next'));

  });

  test('click next in change password form step 2 and navigates to success screen', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your password')); 
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('next')); 
  });


  test('cancel functionality returns to main account settings', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your email')); 
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); 
    fireEvent.click(screen.getByText('cancel')); 


    expect(screen.getByText('change your email')).toBeInTheDocument();
    expect(screen.getByText('change your password')).toBeInTheDocument();
  });
});
