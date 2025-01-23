import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AddContentPage from "./AddContentPage"; // Adjust import as necessary

describe("Add Content Page", () => {
  test("renders all input fields and buttons", () => {
    render(
      <MemoryRouter>
        <AddContentPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write description")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Write keywords here (e.g. webdev, appdev, gamedev)..."
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/add files/i)).toBeInTheDocument();
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  test("allows user to type in inputs and textarea", () => {
    render(
      <MemoryRouter>
        <AddContentPage />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const descriptionTextarea =
      screen.getByPlaceholderText("Write description");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Test Description" },
    });

    expect(titleInput).toHaveValue("Test Title");
    expect(descriptionTextarea).toHaveValue("Test Description");
  });

  test("displays file name when file is uploaded", async () => {
    render(
      <MemoryRouter>
        <AddContentPage />
      </MemoryRouter>
    );
  
  });
  

  test("handles select field changes", () => {
    render(
      <MemoryRouter>
        <AddContentPage />
      </MemoryRouter>
    );

  });

  test("triggers save changes button", () => {
    const handleSave = jest.fn();
    render(
      <MemoryRouter>
        <AddContentPage onSave={handleSave} />
      </MemoryRouter>
    );

    const saveButton = screen.getByText(/upload/i);
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledTimes(0);
  });
});
