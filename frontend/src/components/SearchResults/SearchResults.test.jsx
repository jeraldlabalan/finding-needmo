import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";


const SearchResultComponent = () => {
  const [programFilter, setProgramFilter] = useState("");

  const handleProgramFilterChange = (event) => {
    setProgramFilter(event.target.value);
  };

  const getColor = (value) => (value ? "black" : "gray");

  return (
    <div className="container">
      <div className="search_result_header">
        <h1>Search Results</h1>
      </div>

      <div className="search_result_content">
        {/* Side Bar */}
        <div className="search_result_sidebar">
          <div className="search_result_sidebar_filter">
            <h3>sort by</h3>
            <div className="search_result_sidebar_filter_options_container">
              <div className="search_result_sidebar_filter_option">
                <input type="checkbox" id="oldestToNewest" />
                <label htmlFor="oldestToNewest">Oldest to Newest</label>
              </div>

              <div className="search_result_sidebar_filter_option">
                <input type="checkbox" id="relevance" />
                <label htmlFor="relevance">Relevance</label>
              </div>

              <div className="search_result_sidebar_filter_option">
                <input type="checkbox" id="program" />
                <label htmlFor="program">
                  Program
                  <select
                    value={programFilter}
                    onChange={handleProgramFilterChange}
                    style={{ color: getColor(programFilter) }}
                    aria-label="Program Filter"
                  >
                    <option value="">All</option>
                    <option value="1">Computer Science</option>
                    <option value="2">Information Technology</option>
                  </select>
                </label>
              </div>

              <div className="search_result_sidebar_filter_option">
                <input type="checkbox" id="subject" />
                <label htmlFor="subject">
                  Subject
                  <select name="subject" aria-label="Subject Filter">
                    <option value="introduction-to-computing">
                      Introduction to Computing
                    </option>
                    <option value="computer-programming-1">
                      Computer Programming I
                    </option>
                    <option value="computer-programming-2">
                      Computer Programming II
                    </option>
                    <option value="object-oriented-programming">OOP</option>
                    <option value="data-structures-and-algorithms">DSA</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

describe("Search Result Component", () => {
  test("should render the header and sidebar filters", () => {
    render(<SearchResultComponent />);
    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.getByText("sort by")).toBeInTheDocument();
  });

  test("should render checkboxes with labels", () => {
    render(<SearchResultComponent />);
    expect(screen.getByLabelText("Oldest to Newest")).toBeInTheDocument();
    expect(screen.getByLabelText("Relevance")).toBeInTheDocument();
  });

  test("should update the program filter when a new option is selected", () => {
    render(<SearchResultComponent />);
    const programSelect = screen.getByLabelText("Program Filter");

    fireEvent.change(programSelect, { target: { value: "1" } });
    expect(programSelect.value).toBe("1");

    fireEvent.change(programSelect, { target: { value: "2" } });
    expect(programSelect.value).toBe("2");
  });

  test("should render subject options", () => {
    render(<SearchResultComponent />);
    const subjectSelect = screen.getByLabelText("Subject Filter");
    expect(subjectSelect).toBeInTheDocument();
    expect(subjectSelect).toHaveValue("introduction-to-computing");
  });

  test("should have default styles applied to the program filter", () => {
    render(<SearchResultComponent />);
    const programSelect = screen.getByLabelText("Program Filter");

    expect(programSelect).toHaveStyle("color: gray");
    fireEvent.change(programSelect, { target: { value: "1" } });
    expect(programSelect).toHaveStyle("color: black");
  });
});






const SearchResultMainContentComponent = ({ filteredResults, docx }) => {
  const [activeButton, setActiveButton] = useState("contents");

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <div className="search_result_main_content">
      <div className="search_result_main_content_header">
        <button
          className={`button ${activeButton === "contents" ? "active_button" : ""}`}
          onClick={() => handleButtonClick("contents")}
        >
          Contents
        </button>
        <button
          className={`button ${activeButton === "documents" ? "active_button" : ""}`}
          onClick={() => handleButtonClick("documents")}
        >
          Documents
        </button>
        <button
          className={`button ${activeButton === "presentations" ? "active_button" : ""}`}
          onClick={() => handleButtonClick("presentations")}
        >
          Presentations
        </button>
        <button
          className={`button ${activeButton === "pdfs" ? "active_button" : ""}`}
          onClick={() => handleButtonClick("pdfs")}
        >
          PDFs
        </button>
      </div>

      <div className="search_result_main_content_body">
        {activeButton === "contents" && (
          <>
            {filteredResults.map((row, index) => (
              <div key={index} className="main_content_body_item">
                <div className="upper_section">
                  <h3>{row.Title}</h3>
                  <p>{row.Firstname} {row.Lastname}</p>
                </div>
                <div className="lower_section">
                  <p>{row.CourseTitle}</p>
                  {row.Program === 1 ? (
                    <p className="lower_section_program_cs">Computer Science</p>
                  ) : (
                    <p className="lower_section_program_it">Information Technology</p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {activeButton === "documents" && (
          <>
            <div className="document_container">
              {docx.length > 0 ? (
                docx.map((item, index) => {
                  const docxFiles = item.docxFiles;

                  if (docxFiles.length === 0) {
                    return null;
                  }

                  return docxFiles.map((file, fileIndex) => {
                    const fileUrl = `http://localhost:8080/${file.path.replace(/\\/g, "/")}`;
                    return (
                      <div key={`${index}-${fileIndex}`}>
                        <a href={fileUrl} download={file.originalName} target="_blank" className="document">
                          <div className="thumbnail_container">
                            <img
                              src={"thumbnail3.jpg"}
                              alt={file.originalName}
                              className="document_thumbnail"
                            />
                            <div className="lesson_text">{item.Title}</div>
                          </div>

                          <div className="document_details">
                            <h3>{file.originalName}</h3>
                            <p>{item.Firstname} {item.Lastname}</p>
                          </div>
                        </a>
                      </div>
                    );
                  });
                })
              ) : (
                <p>No PPT files available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

describe("Search Result Main Content", () => {
  const mockFilteredResults = [
    {
      Title: "Lesson 1",
      Firstname: "John",
      Lastname: "Doe",
      CourseTitle: "Intro to Programming",
      Program: 1,
    },
    {
      Title: "Lesson 2",
      Firstname: "Jane",
      Lastname: "Smith",
      CourseTitle: "Data Structures",
      Program: 2,
    },
  ];

  const mockDocx = [
    {
      Title: "Lesson 1",
      Firstname: "John",
      Lastname: "Doe",
      docxFiles: [{ path: "path/to/file1.docx", originalName: "File1.docx" }],
    },
    {
      Title: "Lesson 2",
      Firstname: "Jane",
      Lastname: "Smith",
      docxFiles: [{ path: "path/to/file2.docx", originalName: "File2.docx" }],
    },
  ];

  test("should render 'Contents' by default", () => {
    render(<SearchResultMainContentComponent filteredResults={mockFilteredResults} docx={mockDocx} />);
    expect(screen.getByText("Lesson 1")).toBeInTheDocument();
    expect(screen.getByText("Intro to Programming")).toBeInTheDocument();
  });

  test("should switch to 'Documents' when the button is clicked", () => {
    render(<SearchResultMainContentComponent filteredResults={mockFilteredResults} docx={mockDocx} />);
    fireEvent.click(screen.getByText("Documents"));
    expect(screen.getByText("File1.docx")).toBeInTheDocument();
    expect(screen.getByText("File2.docx")).toBeInTheDocument();
  });

  test("should render 'No PPT files available' when no documents are present", () => {
    render(<SearchResultMainContentComponent filteredResults={mockFilteredResults} docx={[]} />);
    fireEvent.click(screen.getByText("Documents"));
    expect(screen.getByText("No PPT files available")).toBeInTheDocument();
  });

  test("should switch tabs correctly between 'Contents' and 'Documents'", () => {
    render(<SearchResultMainContentComponent filteredResults={mockFilteredResults} docx={mockDocx} />);
    fireEvent.click(screen.getByText("Documents"));
    expect(screen.getByText("File1.docx")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Contents"));
    expect(screen.getByText("Lesson 1")).toBeInTheDocument();
  });
});



const SearchResultPaginationComponent = ({ ppts, pdfs, currentPage, totalPages, handlePreviousPage, handleNextPage, setCurrentPage }) => {
  const [activeButton, setActiveButton] = useState("presentations");

  return (
    <div className="search_result_main_content">
      {activeButton === "presentations" && (
        <>
          <div className="presentation_container">
            {ppts.length > 0 ? (
              ppts.map((item, index) => {
                const pptFiles = item.pptFiles;

                if (pptFiles.length === 0) {
                  return null;
                }

                return pptFiles.map((file, fileIndex) => {
                  const fileUrl = `http://localhost:8080/${file.path.replace(/\\/g, "/")}`;
                  return (
                    <div key={`${index}-${fileIndex}`}>
                      <a href={fileUrl} download={file.originalName} target="_blank" className="document">
                        <div className="thumbnail_container">
                          <img
                            src={"thumbnail3.jpg"}
                            alt={file.originalName}
                            className="document_thumbnail"
                          />
                          <div className="lesson_text">{item.Title}</div>
                        </div>

                        <div className="document_details">
                          <h3>{file.originalName}</h3>
                          <p>{item.Firstname} {item.Lastname}</p>
                        </div>
                      </a>
                    </div>
                  );
                });
              })
            ) : (
              <p>No PPT files available</p>
            )}
          </div>
        </>
      )}

      {activeButton === "pdfs" && (
        <>
          <div className="pdf_container">
            {pdfs.length > 0 ? (
              pdfs.map((item, index) => {
                const pdfFiles = item.pdfFiles;

                if (pdfFiles.length === 0) {
                  return null;
                }

                return pdfFiles.map((file, fileIndex) => {
                  const fileUrl = `http://localhost:8080/${file.path.replace(/\\/g, "/")}`;
                  return (
                    <div key={`${index}-${fileIndex}`}>
                      <a href={fileUrl} download={file.originalName} target="_blank" className="document">
                        <div className="thumbnail_container">
                          <img
                            src={"thumbnail3.jpg"}
                            alt={file.originalName}
                            className="document_thumbnail"
                          />
                          <div className="lesson_text">{item.Title}</div>
                        </div>

                        <div className="document_details">
                          <h3>{file.originalName}</h3>
                          <p>{item.Firstname} {item.Lastname}</p>
                        </div>
                      </a>
                    </div>
                  );
                });
              })
            ) : (
              <p>No PDF files available</p>
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="search_result_footer">
        <div className="search_result_footer_nav">
          <img
            src="nav_arrow.jpg"
            className="search_result_footer_nav_button"
            alt="previous arrow"
            onClick={handlePreviousPage}
            style={currentPage === 1 ? { opacity: "30%" } : {}}
          />

          <div className="search_result_footer_nav_page">
            {[...Array(totalPages)].map((_, index) => (
              <img
                key={index}
                src={index + 1 === currentPage ? "current_page.jpg" : "next_page.jpg"}
                className={`page ${index + 1 === currentPage ? "current_page" : ""}`}
                alt={`Page ${index + 1}`}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}
          </div>

          <img
            src="nav_arrow.jpg"
            className="search_result_footer_nav_button rotated"
            alt="next arrow"
            onClick={handleNextPage}
            style={currentPage === totalPages ? { opacity: "30%" } : {}}
          />
        </div>

        <div className="search_result_footer_page">
          <span className="search_result_footer_page_number">{currentPage}</span>
          of
          <span className="search_result_footer_total_page_number">{totalPages}</span>
        </div>
      </div>
    </div>
  );
};


describe("Search Result Pagination", () => {
  const mockPpts = [
    {
      Title: "Presentation 1",
      Firstname: "John",
      Lastname: "Doe",
      pptFiles: [
        { path: "path/to/file1.ppt", originalName: "File1.ppt" },
      ],
    },
    {
      Title: "Presentation 2",
      Firstname: "Jane",
      Lastname: "Smith",
      pptFiles: [
        { path: "path/to/file2.ppt", originalName: "File2.ppt" },
      ],
    },
  ];

  const mockPdfs = [
    {
      Title: "PDF 1",
      Firstname: "Michael",
      Lastname: "Jones",
      pdfFiles: [
        { path: "path/to/file1.pdf", originalName: "File1.pdf" },
      ],
    },
    {
      Title: "PDF 2",
      Firstname: "Emily",
      Lastname: "Davis",
      pdfFiles: [
        { path: "path/to/file2.pdf", originalName: "File2.pdf" },
      ],
    },
  ];

  it("should render 'No PPT files available' when no presentations are present", () => {
    render(<SearchResultPaginationComponent ppts={[]} pdfs={mockPdfs} currentPage={1} totalPages={3} />);
    expect(screen.getByText("No PPT files available")).toBeInTheDocument();
  });

  {/** 
  it("should switch to PDFs and render them correctly", () => {
    render(<SearchResultPaginationComponent ppts={mockPpts} pdfs={mockPdfs} currentPage={1} totalPages={3} />);
    fireEvent.click(screen.getByText("PDFs"));
    expect(screen.getByText("File1.pdf")).toBeInTheDocument();
    expect(screen.getByText("File2.pdf")).toBeInTheDocument();
  });

  it("should switch to 'Presentations' when clicking on the presentations button", () => {

    expect(screen.getByText("File1.ppt")).toBeInTheDocument();
    expect(screen.getByText("File2.ppt")).toBeInTheDocument();
  });*/}

test ("should paginate correctly when next and previous buttons are clicked", () => {
    const mockHandlePreviousPage = jest.fn();
    const mockHandleNextPage = jest.fn();
    const mockSetCurrentPage = jest.fn();

    render(
      <SearchResultPaginationComponent
        ppts={mockPpts}
        pdfs={mockPdfs}
        currentPage={1}
        totalPages={5}
        handlePreviousPage={mockHandlePreviousPage}
        handleNextPage={mockHandleNextPage}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    fireEvent.click(screen.getByAltText("next arrow"));
    expect(mockHandleNextPage).toHaveBeenCalled();

    fireEvent.click(screen.getByAltText("previous arrow"));
    expect(mockHandlePreviousPage).toHaveBeenCalled();
  });
});
