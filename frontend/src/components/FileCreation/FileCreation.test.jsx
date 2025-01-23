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


  test('redirects to login page if user is not valid', async () => {

 
  });

  test('handles axios error gracefully', async () => {

 
  });

  test('cleans up Web Viewer instance on unmount', async () => {

});
});