import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";



const mockFiles = [
  { id: 1, title: "Presentation on Arrays", author: "Lele Pons", extension: "pdf" },
  { id: 2, title: "Array Notes", author: "Lele Pons", extension: "doc" },
];

const mockThumbnailMapping = {
  pdf: "/pdf-thumbnail.png",
  doc: "/doc-thumbnail.png",
};

const SecondHeader = () => <div data-testid="second-header">SecondHeader Component</div>;

const styles = {
  container: "container",
  view_content_header: "view_content_header",
  go_back_button_container: "go_back_button_container",
  go_back_button: "go_back_button",
  content_container: "content_container",
  content: "content",
  content_author_and_keywords_container: "content_author_and_keywords_container",
  content_author_container: "content_author_container",
  content_keywords_container: "content_keywords_container",
  content_title_and_description_container: "content_title_and_description_container",
  items_container: "items_container",
  item: "item",
  item_thumbnail: "item_thumbnail",
};

const Component = ({ files, thumbnailMapping }) => (
  <div className={styles.container}>
    <div className={styles.view_content_header}>
      <SecondHeader />
    </div>

    <div className={styles.content_container}>
      <div className={styles.go_back_button_container}>
        <button className={styles.go_back_button} data-testid="go-back-button">
          <img src="/go_back.png" alt="go back" />
          Go Back
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.content_author_and_keywords_container}>
          <div className={styles.content_author_container}  data-testid="author-container">
            <img src="/uploadedPFP.png" alt="Author" />
            <div>
              <h4>Lele Pons</h4>
              <p>Computer Science</p>
            </div>
          </div>
          <div className={styles.content_keywords_container}>
            {["Arrays", "Data Types", "Data Structure and Algorithm"].map((keyword) => (
              <div key={keyword} className={styles.content_keywords}>
                <p>{keyword}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.content_title_and_description_container}>
          <div>
            <h1>arrays</h1>
            <img src="/greater_icon.png" alt=">" />
            <p>computer programming II</p>
          </div>
          <div>
            <p>
              An array is a collection of data or items stored in contiguous memory locations, or database systems. Arrays can be used to organize numbers, pictures, or objects in rows and columns.
            </p>
          </div>
        </div>

        <div className={styles.items_container}>
          {files.map((file) => (
            <div key={file.id} className={styles.item}>
              <img
                src={thumbnailMapping[file.extension]}
                alt={file.title}
                className={styles.item_thumbnail}
              />
              <div>
                <h3>{file.title}</h3>
                <p>{file.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


describe(" View Component", () => {

    test("renders header, back button, and author details", () => {
        render(<Component files={mockFiles} thumbnailMapping={mockThumbnailMapping} />);
      
        expect(screen.getByTestId("second-header")).toBeInTheDocument();
      

        expect(screen.getByTestId("go-back-button")).toHaveTextContent("Go Back");
      
        const authorContainer = screen.getByTestId("author-container");
        expect(within(authorContainer).getByText("Lele Pons")).toBeInTheDocument();
        expect(within(authorContainer).getByText("Computer Science")).toBeInTheDocument();
      });
 

  test("renders content keywords", () => {
    render(<Component files={mockFiles} thumbnailMapping={mockThumbnailMapping} />);

    const keywords = ["Arrays", "Data Types", "Data Structure and Algorithm"];
    keywords.forEach((keyword) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  test("renders files with correct thumbnails", () => {
    render(<Component files={mockFiles} thumbnailMapping={mockThumbnailMapping} />);

    mockFiles.forEach((file) => {
      const thumbnail = screen.getByAltText(file.title);
      expect(thumbnail).toHaveAttribute("src", mockThumbnailMapping[file.extension]);
    });
  });

  test("renders title and description", () => {
    render(<Component files={mockFiles} thumbnailMapping={mockThumbnailMapping} />);

    expect(screen.getByText("arrays")).toBeInTheDocument();
    expect(screen.getByText("computer programming II")).toBeInTheDocument();
    expect(
      screen.getByText(
        /An array is a collection of data or items stored in contiguous memory locations/
      )
    ).toBeInTheDocument();
  });
});
