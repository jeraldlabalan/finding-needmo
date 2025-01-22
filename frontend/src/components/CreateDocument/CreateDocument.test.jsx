import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";


const CreateDocument = () => {
  const [activeButton, setActiveButton] = useState("document");

  const handleButtonClick = (type) => {
    setActiveButton(type);
  };

  return (
    <div className="create_document_container">
      <div className="create_document_header_container">
        <h1>Header</h1>
      </div>

      <div className="logo_container">
        <img className="logo" src="logo" alt="logo" />
      </div>

      <div className="create_document_main_content">
        <div className="main_content_header">
          <button
            className={`main_content_header_button ${
              activeButton === "document" ? "active_button" : ""
            }`}
            onClick={() => handleButtonClick("document")}
          >
            document
          </button>
          <button
            className={`main_content_header_button ${
              activeButton === "presentation" ? "active_button" : ""
            }`}
            onClick={() => handleButtonClick("presentation")}
          >
            presentation
          </button>
        </div>

        <div className="main_content_content">
          <label htmlFor="file-upload" className="add_file_button">
            <div>
              <img src="add_file" alt="add" />
              <input type="file" id="file-upload" />
            </div>
            <p>create new file</p>
          </label>

          {activeButton === "document" && (
            <>
              {Array(8)
                .fill()
                .map((_, index) => (
                  <div key={index} className="file_container">
                    <img className="file_icon" src="file_icon_black" alt="file icon" />
                    <p>File {index + 1}</p>
                    <img className="delete_icon" src="delete_icon" alt="delete icon" />
                  </div>
                ))}
            </>
          )}

          {activeButton === "presentation" && (
            <div>
              <p>No presentations available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


describe("Create Document Component", () => {
  test("should render the header and logo", () => {
    render(<CreateDocument />);
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  test("should render document tab and display files by default", () => {
    render(<CreateDocument />);
    expect(screen.getByText("document")).toHaveClass("active_button");
    expect(screen.getAllByText(/File/)).toHaveLength(8);
  });

  test("should switch to presentation tab when the button is clicked", () => {
    render(<CreateDocument />);
    const presentationButton = screen.getByText("presentation");
    fireEvent.click(presentationButton);

    expect(presentationButton).toHaveClass("active_button");
    expect(screen.getByText("No presentations available")).toBeInTheDocument();
  });

  test("should switch back to document tab when the button is clicked", () => {
    render(<CreateDocument />);
    const documentButton = screen.getByText("document");
    fireEvent.click(documentButton);

    expect(documentButton).toHaveClass("active_button");
    expect(screen.getAllByText(/File/)).toHaveLength(8);
  });

  test("should render the file upload label", () => {
    render(<CreateDocument />);
    expect(screen.getByText("create new file")).toBeInTheDocument();
  });

  test("should render file containers with delete icons in document tab", () => {
    render(<CreateDocument />);
    const deleteIcons = screen.getAllByAltText("delete icon");
    expect(deleteIcons).toHaveLength(8);
  });
});

