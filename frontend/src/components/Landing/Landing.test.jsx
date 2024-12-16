import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Landing from "../Landing/Landing.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "/src/components/Landing/Landing.module.css";

beforeAll(() => {
  jest.spyOn(screen, "debug").mockImplementation(() => {});
});

afterAll(() => {
  screen.debug.mockRestore();
});

describe("Unit Testing for the Landing Page", () => {
  const mockOpenModal = jest.fn();

  describe("Header", () => {
    test("Renders the logo image", () => {
      render(
        <Router>
          <Landing openModal={mockOpenModal} />
        </Router>
      );
      const logoImage = screen.getByAltText("logo");
      expect(logoImage).toBeInTheDocument();
    });

    test("Renders login button and directs to the appropriate link", () => {
      render(
        <Router>
          <Landing openModal={mockOpenModal} />
        </Router>
      );
      const loginButton = screen.getByRole("button", { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      const loginLink = screen.getByRole("link", { name: /log in/i });
      expect(loginLink).toHaveAttribute("href", "/registerlogin?form=login");
    });

    test("Renders join now button", () => {
      render(
        <Router>
          <Landing openModal={mockOpenModal} />
        </Router>
      );
      const joinButton = screen.getByRole("button", { name: /join now/i });
      expect(joinButton).toBeInTheDocument();
    });

    test("Triggers openModal when join now button is clicked", async () => {
      await act(async () => {
        render(
          <Router>
            <Landing />
          </Router>
        );
      });
      const joinNowButton = screen.getByRole("button", { name: /join now/i });
      fireEvent.click(joinNowButton);
      await waitFor(() => {
        const modal = screen.getByTestId("modal");
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe("Modal Behavior", () => {
    test("Renders modal content correctly", async () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      const joinNowButton = screen.getByRole("button", { name: /join now/i });
      fireEvent.click(joinNowButton);
      const modalTitle = screen.getByText(/join us/i);
      const modalSubtitle = screen.getByText(
        /Create an account to unlock features, stay updated and connect with students and educators around the world./i
      );
      expect(modalTitle).toBeInTheDocument();
      expect(modalSubtitle).toBeInTheDocument();
    });

    test("Opens and closes the modal when clicking 'join now' button", async () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      const joinNowButton = screen.getByText(/join now/i);
      fireEvent.click(joinNowButton);
      const modalTitle = await screen.findByRole("heading", {
        name: /join us/i,
      });
      expect(modalTitle).toBeInTheDocument();
      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);
      await waitFor(() => {
        expect(screen.queryByText(/join us/i)).not.toBeInTheDocument();
      });
    });

    test("Modal buttons navigate correctly", () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      fireEvent.click(screen.getByText(/join now/i));
      fireEvent.click(screen.getByTestId("login-button"));
      expect(window.location.pathname).toBe("/registerlogin");
      expect(window.location.search).toBe("?form=login");
    });

    test("Should close the modal when cancel button is clicked", () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      const joinNowButton = screen.getByText(/join now/i);
      fireEvent.click(joinNowButton);
      const modal = screen.getByTestId("modal");
      expect(modal).toBeInTheDocument();
      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);
      expect(modal).not.toBeInTheDocument();
    });

    test("Clicking inside modal content does not close the modal", async () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      const joinNowButton = screen.getByText(/join now/i);
      fireEvent.click(joinNowButton);
      screen.debug();
      const modal = screen.getByRole("dialog", { name: /join us/i });
      expect(modal).toBeInTheDocument();
      const modalContent = within(modal).getByText(/join us/i);
      fireEvent.click(modalContent);
      expect(modalContent).toBeInTheDocument();
    });

    test("Clicking outside modal content closes the modal", async () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
      const joinNowButton = screen.getByRole("button", { name: /join now/i });
      fireEvent.click(joinNowButton);
      const modalOverlay = screen.getByTestId("modal");
      fireEvent.click(modalOverlay);
      expect(screen.queryByText(/join us/i)).not.toBeInTheDocument();
    });
  });
});

describe("Search Bar", () => {
  test("Search button click triggers modal open", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    await act(async () => {
      await waitFor(() => screen.getByText(/join us/i));
    });
    expect(screen.getByText(/join us/i)).toBeInTheDocument();
  });

  test("Typing animation works correctly", async () => { //NAGLOLOKO 'TONG HAYOP NA 'TO. MINSAN PASSED, MINSAN FAILED.
    jest.setTimeout(1000);
    render(
      <Router>
        <Landing />
      </Router>
    );
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement.placeholder).toBe("|");
    fireEvent.change(inputElement, { target: { value: "Start Searching..." } });
    await waitFor(
      () => {
        expect(inputElement.placeholder).toBe("Start Searching...");
      },
      { timeout: 5000 }
    );
  });

  test("Clearing input works correctly", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const inputElement = await waitFor(() =>
      screen.getByTestId("search-input")
    );
    fireEvent.change(inputElement, { target: { value: "Test input" } });
    expect(inputElement.value).toBe("Test input");
    fireEvent.change(inputElement, { target: { value: "" } });
    expect(inputElement.value).toBe("");
  });

  test("Cancel button clears input correctly", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const inputElement = await screen.findByTestId("search-input");
    fireEvent.change(inputElement, { target: { value: "Test input" } });
    expect(inputElement.value).toBe("Test input");
    const joinNowButton = screen.getByText(/join now/i);
    fireEvent.click(joinNowButton);
    const cancelButton = await screen.findByText(/cancel/i);
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(inputElement.value).toBe("");
      expect(inputElement.placeholder).toBe("");
    });
  });

  test("Should handle focus correctly", async () => {
    await act(async () => {
      render(
        <Router>
          <Landing />
        </Router>
      );
    });
    const input = await screen.findByTestId("search-input");
    expect(input).toBeInTheDocument();
    expect(input).toBeEnabled();
    input.focus();
    await act(() => expect(input).toHaveFocus());
    expect(input).toHaveValue("");
  });

  test("Should handle blur correctly", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const input = screen.getByTestId("search-input");
    await act(async () => {
      fireEvent.focus(input);
      fireEvent.blur(input);
    });
    expect(input).not.toHaveFocus();
    expect(input.placeholder).toBe("|");
    expect(input).not.toHaveFocus();
  });
});

jest.mock("/src/assets/search-icon.png", () => "search_icon.svg");
jest.mock("/src/assets/landing-photo.png", () => "/assets/landing-photo.png");

describe("Content", () => {
  test("Renders landing photo correctly", () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const imageElement = screen.getByAltText(/landing photo/i);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain("/assets/landing-photo.png");
  });

  test("Renders title and subtitle correctly", () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    expect(
      screen.getByText(
        (content) =>
          content.includes("For students") && content.includes("by students")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(
          "Discover new knowledge, uncover insights and share educational contents that matter the most."
        )
      )
    ).toBeInTheDocument();
  });

  test("Renders search icon inside the button", () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const icon = screen.getByAltText(/search icon/i);
    expect(icon).toBeInTheDocument();
  });

  test("Renders search bar and correct placeholder text", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement.placeholder).toBe("|");
    await waitFor(
      () => {
        expect(inputElement.placeholder).toContain("Start Searching...");
      },
      { timeout: 5000 }
    );
  });
});

jest.mock(
  "/src/assets/computer-science.png",
  () => "/assets/computer-science.png"
);
jest.mock(
  "/src/assets/information-technology.png",
  () => "/assets/information-technology.png"
);

describe("Footer", () => {
  test("Should render the footer section with the correct title", () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const footer = screen.getByTestId("footer");
    const materialsTitle = footer.querySelector("h3");
    expect(materialsTitle).toHaveTextContent("Materials");
  });

  test("Should render two sets of images within slide content", async () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    await waitFor(() => {
      const slideContent = screen.getAllByTestId("slide-content");
      expect(slideContent.length).toBe(2);
    });
    const slideContent = screen.getAllByTestId("slide-content");
    const firstSetImages = slideContent[0].getElementsByTagName("img");
    expect(firstSetImages.length).toBe(2);
    expect(firstSetImages[0]).toHaveAttribute(
      "alt",
      "This is computer science"
    );
    expect(firstSetImages[1]).toHaveAttribute(
      "alt",
      "This is information technology"
    );
    const secondSetImages = slideContent[1].getElementsByTagName("img");
    expect(secondSetImages.length).toBe(2);
    expect(secondSetImages[0]).toHaveAttribute(
      "alt",
      "This is computer science"
    );
    expect(secondSetImages[1]).toHaveAttribute(
      "alt",
      "This is information technology"
    );
  });

  test("Should render images with correct src attributes", () => {
    render(
      <Router>
        <Landing />
      </Router>
    );
    const computerScienceImages = screen.getAllByAltText(
      "This is computer science"
    );
    const informationTechnologyImages = screen.getAllByAltText(
      "This is information technology"
    );
    expect(computerScienceImages.length).toBeGreaterThan(0);
    expect(informationTechnologyImages.length).toBeGreaterThan(0);
    expect(computerScienceImages[0].src).toContain(
      "assets/computer-science.png"
    );
    expect(informationTechnologyImages[0].src).toContain(
      "assets/information-technology.png"
    );
  });

  test("Animation for slide content", () => {
    const { container } = render(
      <Router>
        <Landing />
      </Router>
    );
    const slideContentContainer = screen.getByTestId("slide-content-container");
    expect(slideContentContainer.classList.contains(styles.animate)).toBe(true);
  });
});
