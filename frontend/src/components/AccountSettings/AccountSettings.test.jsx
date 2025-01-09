import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AccountSettings from './AccountSettings'; // Correct path to your component


// Mock necessary images for the test
jest.mock('../../assets/account-settings-icon.png', () => 'account-setting-icon.png');
jest.mock('../../assets/email-icon-white.png', () => 'email-icon-white.png');
jest.mock('../../assets/verify-icon-black.png', () => 'verify-icon-black.png');
jest.mock('../../assets/email.png', () => 'email.png');
jest.mock('../../assets/verified_icon.png', () => 'verified_icon.png');

describe('AccountSettings', () => {
  // Test if the main elements (logo, titles) are rendered on initial load
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

  // Test the 'next' button in the change email process, navigating between steps
  test('click next in change email form step 1 and rending step 2', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your email')); // Open change email form
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); // Simulate typing password
    fireEvent.click(screen.getByText('next')); // Go to next step

    //if we are on step 2 of change email process
    expect(screen.getByText('change email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New email address')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });

  // Test the 'next' button in the change email form, navigating to success screen
  test('click next in change email form step 2 and navigates to success screen', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );
  
    fireEvent.click(screen.getByText('change your email'));
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('next'));
  
    fireEvent.change(screen.getByPlaceholderText('New email address'), { target: { value: 'new-email@gmail.com' } });
    fireEvent.click(screen.getByText('next'));
    

    expect(screen.getByText(/email address changed!/i)).toBeInTheDocument();
    expect(screen.getByText(/Your email address has been successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/go back/i)).toBeInTheDocument();
  });
  

  // if the user choose change password
  test('navigates to change password form', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    const changePasswordButton = screen.getByText('change your password');
    fireEvent.click(changePasswordButton);

    //if we are in the password change form (step 1)
    expect(screen.getByText('verify your password')).toBeInTheDocument();
    expect(screen.getByText('Re-enter your Finding NeedMo password to continue.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });

  // Test the 'next' button in the change password process, navigating between steps
  test('click next in change password form step 1 and rending step 2', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your password')); // Open change password form
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); // Simulate typing password
    fireEvent.click(screen.getByText('next')); // Go to next step

    // if we are on step 2 of change password process
    expect(screen.getByText('change password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
    expect(screen.getByText('update password')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('forgot password?')).toBeInTheDocument();

  });

  // Test the 'next' button in the change password form, navigating to success screen
  test('click next in change password form step 2 and navigates to success screen', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your password')); // Open change password form
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); // Simulate typing password
    fireEvent.click(screen.getByText('next')); // Go to step 2
    fireEvent.change(screen.getByPlaceholderText('Current password'), { target: { value: 'password123' } }); // Simulate typing current password
    fireEvent.change(screen.getByPlaceholderText('New password'), { target: { value: 'newpassword123' } }); // Simulate typing new password
    fireEvent.change(screen.getByPlaceholderText('Confirm new password'), { target: { value: 'newpassword123' } }); // Simulate typing confirm password
    fireEvent.click(screen.getByText('update password')); // Go to success step

    // success message
    expect(screen.getByText('password changed!')).toBeInTheDocument();
    expect(screen.getByText('Your email address has been successfully updated.')).toBeInTheDocument();
    expect(screen.getByText('go back')).toBeInTheDocument();
  });

  // Test cancel functionality
  test('cancel functionality returns to main account settings', () => {
    render(
      <Router>
        <AccountSettings />
      </Router>
    );

    fireEvent.click(screen.getByText('change your email')); // Open change email form
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } }); // Simulate typing password
    fireEvent.click(screen.getByText('cancel')); // Cancel form

    // Check if we are back to the main account settings
    expect(screen.getByText('change your email')).toBeInTheDocument();
    expect(screen.getByText('change your password')).toBeInTheDocument();
  });
});
