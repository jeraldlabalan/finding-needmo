import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Home from "./Home";


jest.mock("axios");
const mockedAxios = axios;
const mockNavigate = jest.fn();


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


jest.mock("../Header/Header", () => () => <div data-testid="header-component">Header</div>);

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});

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

  
    expect(screen.getByTestId("header-component")).toBeInTheDocument();


    expect(screen.getByAltText("This is the logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByAltText("This is a search icon")).toBeInTheDocument();
 



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


    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080");
    });
    expect(screen.getByAltText("This is the logo")).toBeInTheDocument();
  });

  
});
