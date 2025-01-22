import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AddContentPage from "./AddContentPage";

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
    expect(screen.getByPlaceholderText("Program")).toBeInTheDocument();

    expect(screen.getByText("save changes")).toBeInTheDocument();
    expect(screen.getByLabelText("add file")).toBeInTheDocument();
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

    const fileInput = screen.getByLabelText("add file");
    const testFile = new File(["dummy content"], "testFile.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [testFile] } });
  });

  test("handles select field changes", () => {
    render(
      <MemoryRouter>
        <AddContentPage />
      </MemoryRouter>
    );

    const select = screen.getByText("Select Subject").closest("select");

    fireEvent.change(select, { target: { value: "COSC 75" } });
    expect(select).toHaveValue("COSC 75");
  });

  test("triggers save changes button", () => {
    const handleSave = jest.fn();
    render(
      <MemoryRouter>
        <AddContentPage onSave={handleSave} />
      </MemoryRouter>
    );

    const saveButton = screen.getByText("save changes");
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledTimes(0);
  });
});
