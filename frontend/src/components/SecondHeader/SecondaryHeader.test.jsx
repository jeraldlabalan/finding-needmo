import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SecondHeader from "./SecondHeader"; 

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});

describe("SecondHeader Component", () => {
  test("renders the SecondHeader component with logo and search bar", () => {
    render(
      <MemoryRouter>
        <SecondHeader />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  test("allows user to type in the search bar and perform search", () => {
    render(
      <MemoryRouter>
        <SecondHeader />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput).toHaveValue("test search");

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);
  });

  test("toggles profile dropdown menu", () => {
    render(
      <MemoryRouter>
        <SecondHeader />
      </MemoryRouter>
    );

    const profileButton = screen.getByRole("button", { name: /profile/i });
    fireEvent.click(profileButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });



  test("handles logout functionality", () => {
    render(
      <MemoryRouter>
        <SecondHeader />
      </MemoryRouter>
    );

    const profileButton = screen.getByRole("button", { name: /profile/i });
    fireEvent.click(profileButton);

    const logoutLink = screen.getByText((content) =>
      content.includes("Logout")
    );

    fireEvent.click(logoutLink);
    expect(window.location.pathname).toBe("/");
  });
});
