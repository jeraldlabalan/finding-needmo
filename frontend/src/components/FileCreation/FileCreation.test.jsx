import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileCreation from './FileCreation';
import axios from 'axios';
import WebViewer from '@pdftron/webviewer';
import { useNavigate } from 'react-router-dom';


jest.mock('@pdftron/webviewer');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});

describe('File Creation Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);


    jest.clearAllMocks();
  });

  test('renders FileEditor and initializes WebViewer', async () => {

    axios.get.mockResolvedValue({
      data: {
        valid: true,
        email: 'test@example.com',
        role: 'admin',
      },
    });

    WebViewer.mockImplementation(() => Promise.resolve({ dispose: jest.fn() }));

    render(<FileCreation />);


    expect(screen.getByText('Finding NeedMo')).toBeInTheDocument();

    await waitFor(() => {
      expect(WebViewer).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/webviewer',
          licenseKey: 'YOUR_LICENSE_KEY',
          enableOfficeEditing: true,
        }),
        expect.any(HTMLElement)
      );
    });


    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080');
    });
  });

  test('redirects to login page if user is not valid', async () => {

    axios.get.mockResolvedValue({
      data: { valid: false },
    });

    render(<FileCreation />);


    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/registerlogin');
    });
  });

  test('handles axios error gracefully', async () => {

    axios.get.mockRejectedValue(new Error('Network Error'));

    render(<FileCreation/>);


    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('cleans up Web Viewer instance on unmount', async () => {
    const mockDispose = jest.fn();


    WebViewer.mockImplementation(() => Promise.resolve({ dispose: mockDispose }));

    const { unmount } = render(<FileCreation />);

    await waitFor(() => {
      expect(WebViewer).toHaveBeenCalled();
    });

    unmount();
    expect(mockDispose).toHaveBeenCalled();
  });
});