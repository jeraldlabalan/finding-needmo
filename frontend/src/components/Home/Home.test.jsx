import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Home from "./Home";

// Mock axios and navigate function
jest.mock("axios");
const mockedAxios = axios;
const mockNavigate = jest.fn();

// Mock `useNavigate` hook from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the Header component
jest.mock("../Header/Header", () => () => <div data-testid="header-component">Header</div>);

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component and its elements", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { valid: true, email: "test@example.com" } });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Header component is rendered
    expect(screen.getByTestId("header-component")).toBeInTheDocument();

    // Verify elements like logo, input, and buttons
    expect(screen.getByAltText("This is the logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByAltText("This is a search icon")).toBeInTheDocument();
    expect(screen.getByText("create document")).toBeInTheDocument();
    expect(screen.getByText("create presentation")).toBeInTheDocument();
    expect(screen.getByText("upload content")).toBeInTheDocument();
    expect(screen.getByAltText("This is the download icon")).toBeInTheDocument();
    expect(screen.getByText("view downloaded contents")).toBeInTheDocument();

    // Wait for the axios request to resolve
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080");
    });
  });

  test("navigates to registerlogin if session is invalid", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { valid: false } });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for navigation to be triggered
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080");
      expect(mockNavigate).toHaveBeenCalledWith("/registerlogin");
    });
  });

  test("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for axios to be called
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080");
    });

    // Ensure no crash occurs and user sees rendered content
    expect(screen.getByAltText("This is the logo")).toBeInTheDocument();
  });

  
});
