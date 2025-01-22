import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, Link  } from "react-router-dom"; 

const styles = {
  container: "container",
  search_history_header: "search_history_header",
  profile_menu: "profile_menu",
  active: "active",
  default_profile: "default_profile",
  dropdown_menu: "dropdown_menu",
  active_link: "active_link",
  dropdown_menu_logo: "dropdown_menu_logo",
  search_history_logo: "search_history_logo",
  search_history_container: "search_history_container",
  search_history_content_header: "search_history_content_header",
  search_history_action_buttons: "search_history_action_buttons",
  search_result_main_content_header_button:
    "search_result_main_content_header_button",
  active_button: "active_button",
  back_and_count: "back_and_count",
  content_back_button: "content_back_button",
  select_count: "select_count",
  search_history_content_manipulation: "search_history_content_manipulation",
  content_add_button: "content_add_button",
  content_select_button: "content_select_button",
  content_archive_button: "content_archive_button",
  content_delete_button: "content_delete_button",
};

const uploadedPFP = "uploadedPFP.png";
const profile = "profile.png";
const search_history = "search_history.png";
const account_settings = "account_settings.png";
const manage_content = "manage_content.png";
const logout = "logout.png";
const logo = "logo.png";
const close = "close.png";
const add = "add.png";
const multiple_select_icon = "multiple_select_icon.png";
const clock_back_icon = "clock_back_icon.png";
const trash_icon = "trash_icon.png";

const SearchHistory = ({
  activeDropdown = "profile",
  toggleDropdown = jest.fn(),
  handleLogout = jest.fn(),
  location = { pathname: "/profile" },
  activeButton = "all",
  handleButtonClick,
  isMultipleSelect = false,
  selectedCards = [],
  handleBackClick,
  openAddContentModal,
  handleMultipleSelectClick,
  
}) => (

  <div className={styles.container}>
    <div className={styles.search_history_header}>
      {/* Profile Menu */}
      
      <button
        className={`${styles.profile_menu} ${
          activeDropdown === "profile" ? styles.active : ""
        }`}
        onClick={() => toggleDropdown("profile")}
      >
        <img
          src={uploadedPFP}
          className={styles.default_profile}
          alt="Profile Icon"
        />
      </button>
      {activeDropdown === "profile" && (
        <div className={styles.dropdown_menu}>
          <ul>
            <li
              className={
                location.pathname === "/profile" ? styles.active_link : ""
              }
            >
              <Router>
                <Link to="/profile">
                  <img
                    src={profile}
                    className={styles.dropdown_menu_logo}
                    alt="Profile"
                  />
                  Profile
                </Link>
              </Router>
            </li>
            {/* Additional Links */}
          </ul>
        </div>
      )}
    </div>

    <img src={logo} className={styles.search_history_logo} alt="logo" />

    <div className={styles.search_history_container}>
      <div className={styles.search_history_content_header}>
        <div className={styles.search_history_action_buttons}>
          {!isMultipleSelect ? (
            <>
              <button
                className={`${
                  styles.search_result_main_content_header_button
                } ${activeButton === "all" ? styles.active_button : ""}`}
                onClick={() => handleButtonClick("all")}
              >
                All
              </button>
              <button
                className={`${
                  styles.search_result_main_content_header_button
                } ${activeButton === "archive" ? styles.active_button : ""}`}
                onClick={() => handleButtonClick("archive")}
              >
                Archived
              </button>
            </>
          ) : (
            <div className={styles.back_and_count}>
              <img
                className={styles.content_back_button}
                onClick={handleBackClick}
                src={close}
                alt="Back"
              />
              <p className={styles.select_count}>
                {selectedCards.length} selected
              </p>
            </div>
          )}
        </div>
        <div className={styles.search_history_content_manipulation}>
          {!isMultipleSelect ? (
            <>
              <img
                className={styles.content_add_button}
                src={add}
                alt="add content"
                onClick={openAddContentModal}
              />
              <img
                className={styles.content_select_button}
                src={multiple_select_icon}
                onClick={handleMultipleSelectClick}
                alt="multiple select"
              />
            </>
          ) : (
            <>
              <img
                className={styles.content_archive_button}
                src={clock_back_icon}
                alt="archive content"
              />
              <img
                className={styles.content_delete_button}
                src={trash_icon}
                alt="delete content"
              />
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Tests
describe("Content Management Component", () => {
 {/*  it("should render profile menu with dropdown", () => {
        render(
          <Router>
            <SearchHistory />
          </Router>
        );
    
        const profileIcon = screen.getByAltText("Profile Icon");
        expect(profileIcon).toBeInTheDocument();
    
        fireEvent.click(profileIcon);
        const profileMenu = screen.getByText("Profile");
        expect(profileMenu).toBeInTheDocument();
      });*/} 

  test("should render All and Archived buttons and handle clicks", () => {
    const handleButtonClick = jest.fn();
    render(
      <SearchHistory
        handleButtonClick={handleButtonClick}
        activeButton="all"
      />
    );
    const allButton = screen.getByText("All");
    const archivedButton = screen.getByText("Archived");

    fireEvent.click(allButton);
    expect(handleButtonClick).toHaveBeenCalledWith("all");

    fireEvent.click(archivedButton);
    expect(handleButtonClick).toHaveBeenCalledWith("archive");
  });

  test("should display correct selected count when in multiple select mode", () => {
    render(<SearchHistory isMultipleSelect={true} selectedCards={[1, 2, 3]} />);
    expect(screen.getByText("3 selected")).toBeInTheDocument();
  });
});


const style1 = {
    search_history_content: "search-history-content",
    content_cards: "content-cards",
    card: "card",
    selected_card: "selected-card",
    card_info: "card-info",
    card_title: "card-title",
    card_subtitle: "card-subtitle",
    card_action_container: "card-action-container",
    card_actions: "card-actions",
    action: "action",
    action_icon: "action-icon",
    program_cs: "program-cs",
    program_it: "program-it",
  };
  
  const mockUploadedContent = [
    {
      ContentID: 1,
      Title: "Title 1",
      CourseTitle: "Course 1",
      Program: 1,
    },
    {
      ContentID: 2,
      Title: "Title 2",
      CourseTitle: "Course 2",
      Program: 2,
    },
  ];
  
  const mockArchivedContent = [
    {
      ContentID: 3,
      Title: "Title 3",
      CourseTitle: "Course 3",
      Program: 1,
    },
  ];
  
  const TestComponent = ({
    activeButton,
    uploadedContent,
    archivedContent,
    isMultipleSelect,
    selectedCards,
    handleCardSelect,
    handleEditRow,
    handleArchiveRow,
    handleDeleteRow,
    openEditContentModal,
    openArchiveContentModal,
    handleUnarchiveContent,
  }) => (
    <div className={styles.search_history_content}>
      {activeButton === "all" && (
        <div className={styles.content_cards}>
          {uploadedContent.length > 0 ? (
            uploadedContent.map((details) => (
              <div
                className={`${styles.card} ${
                  isMultipleSelect && selectedCards.includes(details.ContentID)
                    ? styles.selected_card
                    : ""
                }`}
                key={details.ContentID}
                onClick={() =>
                  isMultipleSelect && handleCardSelect(details.ContentID)
                }
              >
                <div className={styles.card_info}>
                  <h4 className={styles.card_title}>{details.Title}</h4>
                  <p className={styles.card_subtitle}>{details.CourseTitle}</p>
                </div>
  
                <div className={styles.card_action_container}>
                  {!isMultipleSelect ? (
                    <div className={styles.card_actions}>
                      <button
                        onClick={() => handleEditRow(details)}
                        className={styles.action}
                      >
                        <img
                          src="edit_icon"
                          className={styles.action_icon}
                          onClick={openEditContentModal}
                          alt="edit icon"
                        />
                      </button>
  
                      <button
                        onClick={() => handleArchiveRow(details)}
                        className={styles.action}
                      >
                        <img
                          src="clock_back_icon"
                          className={styles.action_icon}
                          onClick={openArchiveContentModal}
                          alt="clock back icon"
                        />
                      </button>
  
                      <button className={styles.action}>
                        <img
                          src="delete_icon"
                          className={styles.action_icon}
                          alt="delete icon"
                          onClick={() => handleDeleteRow(details)}
                        />
                      </button>
                    </div>
                  ) : null}
                  <span
                    className={
                      details.Program === 1
                        ? styles.program_cs
                        : details.Program === 2
                        ? styles.program_it
                        : ""
                    }
                  >
                    {details.Program === 1
                      ? "Computer Science"
                      : details.Program === 2
                      ? "Information Technology"
                      : ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No uploaded content found.</p>
          )}
        </div>
      )}
  
      {activeButton === "archive" && (
        <div className={styles.content_cards}>
          {archivedContent.length > 0 ? (
            archivedContent.map((details) => (
              <div
                className={`${styles.card} ${
                  isMultipleSelect && selectedCards.includes(details.ContentID)
                    ? styles.selected_card
                    : ""
                }`}
                key={details.ContentID}
                onClick={() =>
                  isMultipleSelect && handleCardSelect(details.ContentID)
                }
              >
                <div className={styles.card_info}>
                  <h4 className={styles.card_title}>{details.Title}</h4>
                  <p className={styles.card_subtitle}>{details.CourseTitle}</p>
                </div>
  
                <div className={styles.card_action_container}>
                  {!isMultipleSelect ? (
                    <div className={styles.card_actions}>
                      <button
                        className={styles.action}
                        onClick={() => handleUnarchiveContent(details)}
                      >
                        <img
                          src="unarchive_icon"
                          className={styles.action_icon}
                          alt="unarchive icon"
                        />
                      </button>
                    </div>
                  ) : null}
                  <span
                    className={
                      details.Program === 1
                        ? styles.program_cs
                        : details.Program === 2
                        ? styles.program_it
                        : ""
                    }
                  >
                    {details.Program === 1
                      ? "Computer Science"
                      : details.Program === 2
                      ? "Information Technology"
                      : ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No uploaded content found.</p>
          )}
        </div>
      )}
    </div>
  );
  

  describe("Modal", () => {
    test("renders uploaded content when activeButton is 'all'", () => {
      render(
        <TestComponent
          activeButton="all"
          uploadedContent={mockUploadedContent}
          archivedContent={mockArchivedContent}
          isMultipleSelect={false}
          selectedCards={[]}
          handleCardSelect={jest.fn()}
          handleEditRow={jest.fn()}
          handleArchiveRow={jest.fn()}
          handleDeleteRow={jest.fn()}
          openEditContentModal={jest.fn()}
          openArchiveContentModal={jest.fn()}
          handleUnarchiveContent={jest.fn()}
        />
      );
  
      expect(screen.getByText("Title 1")).toBeInTheDocument();
      expect(screen.getByText("Title 2")).toBeInTheDocument();
      expect(screen.queryByText("Title 3")).not.toBeInTheDocument();
    });
  
    test("renders archived content when activeButton is 'archive'", () => {
      render(
        <TestComponent
          activeButton="archive"
          uploadedContent={mockUploadedContent}
          archivedContent={mockArchivedContent}
          isMultipleSelect={false}
          selectedCards={[]}
          handleCardSelect={jest.fn()}
          handleEditRow={jest.fn()}
          handleArchiveRow={jest.fn()}
          handleDeleteRow={jest.fn()}
          openEditContentModal={jest.fn()}
          openArchiveContentModal={jest.fn()}
          handleUnarchiveContent={jest.fn()}
        />
      );
  
      expect(screen.getByText("Title 3")).toBeInTheDocument();
      expect(screen.queryByText("Title 1")).not.toBeInTheDocument();
    });
  });



const AddContentModal = ({
  isAddContentModalOpen,
  closeAddContentModal,
  handleAddContentChange,
  handleAddContent,
  contentDetails = {},
  filteredSubjects = [],
  contentFiles = [],
  handleContentFileChange,
  handleContentFileRemove,
}) => {
  return (
    isAddContentModalOpen && (
      <div className="modal_overlay" onClick={closeAddContentModal}>
        <div
          className="modal_content"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <button
            className="close_button"
            onClick={closeAddContentModal}
          >
            Close
          </button>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={contentDetails.title || ""}
            onChange={handleAddContentChange}
          />

          <textarea
            name="description"
            placeholder="Write description here..."
            value={contentDetails.description || ""}
            onChange={handleAddContentChange}
          ></textarea>

          <select
            name="program"
            value={contentDetails.program || ""}
            onChange={handleAddContentChange}
          >
            <option value="">Program</option>
            <option value="1">Computer Science</option>
            <option value="2">Information Technology</option>
          </select>

          <select
            name="subject"
            value={contentDetails.subject || ""}
            onChange={handleAddContentChange}
          >
            <option value="">Subject</option>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((course) => (
                <option key={course.CourseID} value={course.CourseID}>
                  {course.Title}
                </option>
              ))
            ) : (
              <option disabled>No subjects available</option>
            )}
          </select>

          <textarea
            name="keyword"
            placeholder="Write keywords here..."
            value={contentDetails.keyword || ""}
            onChange={handleAddContentChange}
          ></textarea>

          <div className="file_container">
            {contentFiles.map((file, index) => (
              <div key={index} className="file">
                <span>{file.name}</span>
                <button onClick={() => handleContentFileRemove(index)}>Remove</button>
              </div>
            ))}
            <input
              type="file"
              multiple
              onChange={handleContentFileChange}
            />
          </div>

          <button onClick={handleAddContent}>Add Content</button>
        </div>
      </div>
    )
  );
};

// Tests
describe("Add Content Modal", () => {
  const mockFunctions = {
    closeAddContentModal: jest.fn(),
    handleAddContentChange: jest.fn(),
    handleAddContent: jest.fn(),
    handleContentFileChange: jest.fn(),
    handleContentFileRemove: jest.fn(),
  };

  const mockContentDetails = {
    title: "Test Title",
    description: "Test Description",
    program: "1",
    subject: "Math",
    keyword: "test, example",
  };

  const mockFilteredSubjects = [
    { CourseID: 1, Title: "Math" },
    { CourseID: 2, Title: "Science" },
  ];

  const mockContentFiles = [
    { name: "file1.pdf" },
    { name: "file2.docx" },
  ];

  test("renders modal with correct content", () => {
    render(
      <AddContentModal
        isAddContentModalOpen={true}
        contentDetails={mockContentDetails}
        filteredSubjects={mockFilteredSubjects}
        contentFiles={mockContentFiles}
        {...mockFunctions}
      />
    );

    expect(screen.getByPlaceholderText("Title")).toHaveValue("Test Title");
    expect(screen.getByPlaceholderText("Write description here...")).toHaveValue(
      "Test Description"
    );
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("file1.pdf")).toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(
      <AddContentModal
        isAddContentModalOpen={true}
        contentDetails={mockContentDetails}
        {...mockFunctions}
      />
    );

    const titleInput = screen.getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(mockFunctions.handleAddContentChange).toHaveBeenCalled();
  });

 test("closes modal when clicking outside or on close button", () => {
    render(
      <AddContentModal
        isAddContentModalOpen={true}
        {...mockFunctions}
      />
    );

    fireEvent.click(screen.getByText("Close"));
    expect(mockFunctions.closeAddContentModal).toHaveBeenCalled();
  });

  test("adds content on button click", () => {
    render(
      <AddContentModal
        isAddContentModalOpen={true}
        {...mockFunctions}
      />
    );

    fireEvent.click(screen.getByText("Add Content"));
    expect(mockFunctions.handleAddContent).toHaveBeenCalled();
  });

  test("handles file changes and removal", () => {
    render(
      <AddContentModal
        isAddContentModalOpen={true}
        contentFiles={mockContentFiles}
        {...mockFunctions}
      />
    );
  
    const removeButton = screen.getAllByText("Remove")[0]; 
    fireEvent.click(removeButton);
    expect(mockFunctions.handleContentFileRemove).toHaveBeenCalledWith(0); 
  });
});



const editmodal = {
  modal_overlay: "modal-overlay",
  modal_content: "modal-content",
  modal_content_container: "modal-content-container",
  modal_content_header: "modal-content-header",
  header_close_button: "header-close-button",
  header_close_icon: "header-close-icon",
  modal_content_info_container: "modal-content-info-container",
  subheader_container: "subheader-container",
  subheader_icon: "subheader-icon",
  subheader_description: "subheader-description",
  modal_content_input: "modal-content-input",
  modal_content_text: "modal-content-text",
  modal_content_textarea: "modal-content-textarea",
  modal_content_select: "modal-content-select",
  modal_file_container: "modal-file-container",
  file: "file",
  file_icon: "file-icon",
  file_icon_white: "file-icon-white",
  file_icon_black: "file-icon-black",
  file_name: "file-name",
  add_file: "add-file",
  add_file_button_container: "add-file-button-container",
  save_changes_button_container: "save-changes-button-container",
  save_changes_button: "save-changes-button",
};

const TestEditContentModal = ({
  isEditContentModalOpen,
  selectedRequest,
  editContent,
  programs,
  subjects,
  handleEditContentChange,
  handleEditContentFiles,
  handleEditContentFileRemove,
  handleEditContent,
  closeEditContentModal,
}) => (
  <>
    {isEditContentModalOpen && selectedRequest && (
      <div className={styles.modal_overlay} onClick={closeEditContentModal}>
        <div
          className={`${styles.modal_content} ${styles.modal_content_container}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modal_content_header}>
            <button
              className={styles.header_close_button}
              onClick={closeEditContentModal}
            >
              <img
                src="modal_close_icon"
                className={styles.header_close_icon}
                alt="close icon"
              />
            </button>
          </div>
          <div className={styles.modal_content_info_container}>
            <div className={styles.subheader_container}>
              <img
                src="edit_content_icon"
                className={styles.subheader_icon}
                alt="edit content icon"
              />
              <h2 className={styles.subheader_description}>Edit Content</h2>
            </div>

            <input
              type="text"
              name="contentID"
              value={editContent.contentID}
              onChange={handleEditContentChange}
              style={{ display: "none" }}
            />

            <input
              type="text"
              className={`${styles.modal_content_input} ${styles.modal_content_text}`}
              name="title"
              placeholder="Title"
              value={editContent.title}
              onChange={handleEditContentChange}
            />

            <textarea
              name="description"
              className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
              placeholder="Write description here..."
              value={editContent.description}
              onChange={handleEditContentChange}
            ></textarea>

            <select
              name="program"
              value={editContent.program}
              onChange={handleEditContentChange}
              className={`${styles.modal_content_input} ${styles.modal_content_select}`}
            >
              {programs.map((program) => (
                <option key={program.ProgramID} value={program.ProgramID}>
                  {program.Name}
                </option>
              ))}
            </select>

            <select
              name="subject"
              value={editContent.subject}
              onChange={handleEditContentChange}
              className={`${styles.modal_content_input} ${styles.modal_content_select}`}
            >
              <option value={editContent.subject}>
                {editContent.courseTitle}
              </option>
              {subjects.length > 0 ? (
                subjects.map((course) => (
                  <option value={course.CourseID} key={course.CourseID}>
                    {course.Title}
                  </option>
                ))
              ) : (
                <option disabled>No subjects available</option>
              )}
            </select>

            <textarea
              name="keyword"
              value={editContent.keyword}
              onChange={handleEditContentChange}
              placeholder="Write keywords here..."
              className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
            ></textarea>

            <div className={styles.modal_file_container}>
              {editContent.files &&
                editContent.files.map((file, index) => (
                  <div
                    key={index}
                    className={`${styles.file} ${
                      index % 2 === 0
                        ? styles.file_icon_white
                        : styles.file_icon_black
                    }`}
                  >
                    <img
                      src="file_icon_white"
                      className={styles.file_icon}
                      alt="file icon"
                    />
                    <p className={styles.file_name}>{file.originalName}</p>
                    <img
                      src="delete_file_icon_white"
                      className={styles.file_icon}
                      alt="remove file icon"
                      onClick={() => handleEditContentFileRemove(index)}
                    />
                  </div>
                ))}
              <div className={`${styles.file} ${styles.add_file}`}>
                <button className={styles.add_file_button_container}>
                  <input
                    name="contentInput"
                    type="file"
                    multiple
                    onChange={handleEditContentFiles}
                  />
                  <img
                    src="add_file_icon"
                    className={styles.file_icon}
                    alt="add file icon"
                  />
                  Add files
                </button>
              </div>
            </div>
            <div className={styles.save_changes_button_container}>
              <button
                className={styles.save_changes_button}
                onClick={handleEditContent}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);


describe("Edit Content Modal", () => {
  const mockProps = {
    isEditContentModalOpen: true,
    selectedRequest: true,
    editContent: {
      contentID: "1",
      title: "Test Title",
      description: "Test Description",
      program: "1",
      subject: "1",
      courseTitle: "Course 1",
      keyword: "keyword",
      files: [
        { originalName: "file1.pdf" },
        { originalName: "file2.docx" },
      ],
    },
    programs: [{ ProgramID: "1", Name: "Computer Science" }],
    subjects: [{ CourseID: "1", Title: "Math" }],
    handleEditContentChange: jest.fn(),
    handleEditContentFiles: jest.fn(),
    handleEditContentFileRemove: jest.fn(),
    handleEditContent: jest.fn(),
    closeEditContentModal: jest.fn(),
  };

  test("renders the modal correctly", () => {
    render(<TestEditContentModal {...mockProps} />);
    expect(screen.getByText("Edit Content")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toHaveValue("Test Title");
    expect(screen.getByPlaceholderText("Write description here...")).toHaveValue(
      "Test Description"
    );
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

test("handles input changes", () => {
    render(<TestEditContentModal {...mockProps} />);
    const titleInput = screen.getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    expect(mockProps.handleEditContentChange).toHaveBeenCalled();
  });

  test("closes the modal on overlay click", () => {
    render(<TestEditContentModal {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: "close icon" }));
    expect(mockProps.closeEditContentModal).toHaveBeenCalled();
  });
});



const archive = {
  modal_overlay: "modal-overlay",
  archive_and_delete_content_container: "archive-and-delete-content-container",
  archive_and_delete_content_header: "archive-and-delete-content-header",
  header_close_button: "header-close-button",
  header_close_icon: "header-close-icon",
  subheader_container: "subheader-container",
  subheader_icon: "subheader-icon",
  subheader_description: "subheader-description",
  archive_and_delete_content: "archive-and-delete-content",
  archive_and_delete_confirmation: "archive-and-delete-confirmation",
  confirm_archive_and_delete_container:
    "confirm-archive-and-delete-container",
  confirm_textbox: "confirm-textbox",
  confirm_button: "confirm-button",
  view_button_container: "view-button-container",
  view_archived_contents_button: "view-archived-contents-button",
};

const TestArchiveContentModal = ({
  isArchiveContentModalOpen,
  selectedRequest,
  currentStepArchive,
  archiveContent,
  handleArchiveContentChange,
  handleArchiveContent,
  closeArchiveContentModal,
  setActiveButton,
  setIsArchiveContentModalOpen,
}) => (
  <>
    {isArchiveContentModalOpen && selectedRequest && (
      <div
        className={styles.modal_overlay}
        onClick={closeArchiveContentModal}
      >
        <div
          className={`${styles.archive_and_delete_content_container}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.archive_and_delete_content_header}>
            <button
              className={styles.header_close_button}
              onClick={closeArchiveContentModal}
            >
              <img
                src="modal_close_icon"
                className={styles.header_close_icon}
                alt="close icon"
              />
            </button>
          </div>

          <div className={styles.subheader_container}>
            <img
              src="archive_content_icon"
              className={styles.subheader_icon}
              alt="archive content icon"
            />
            <h2 className={styles.subheader_description}>archive content</h2>
          </div>

          {currentStepArchive === 1 && (
            <div className={styles.archive_and_delete_content}>
              <p className={styles.archive_and_delete_confirmation}>
                Are you sure you want to archive ‘{selectedRequest.Title}’? Type
                ‘{selectedRequest.Title}’ to confirm.
              </p>
              <div className={styles.confirm_archive_and_delete_container}>
                <input
                  type="text"
                  name="contentID"
                  onChange={handleArchiveContentChange}
                  value={archiveContent.contentID}
                  style={{ display: "none" }}
                />
                <input
                  type="text"
                  name="archive"
                  id="archive"
                  value={archiveContent.archive}
                  onChange={handleArchiveContentChange}
                  className={`${styles.confirm_textbox} ${styles.confirm}`}
                  aria-label="archive confirmation" 
                />
                <button
                  className={`${styles.confirm_button} ${styles.confirm}`}
                  onClick={handleArchiveContent}
                >
                  confirm
                </button>
              </div>
            </div>
          )}

          {currentStepArchive === 2 && (
            <div>
              <p className={styles.archive_and_delete_confirmation}>
                Archived ‘{selectedRequest.Title}’ successfully.
              </p>
              <div className={styles.view_button_container}>
                <button
                  className={`${styles.view_archived_contents_button}`}
                  onClick={() => {
                    setActiveButton("archive");
                    setIsArchiveContentModalOpen(false);
                  }}
                >
                  view archived contents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);


describe("Archive Content Modal", () => {
  const mockProps = {
    isArchiveContentModalOpen: true,
    selectedRequest: { Title: "Test Content", ContentID: "123" },
    currentStepArchive: 1,
    archiveContent: { contentID: "123", archive: "" },
    handleArchiveContentChange: jest.fn(),
    handleArchiveContent: jest.fn(),
    closeArchiveContentModal: jest.fn(),
    setActiveButton: jest.fn(),
    setIsArchiveContentModalOpen: jest.fn(),
  };

  test("renders the modal correctly for step 1", () => {
    render(<TestArchiveContentModal {...mockProps} />);
    expect(
      screen.getByText(
        "Are you sure you want to archive ‘Test Content’? Type ‘Test Content’ to confirm."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("confirm")).toBeInTheDocument();
  });

  test("handles input change for archive confirmation", () => {
    render(<TestArchiveContentModal {...mockProps} />);
    const input = screen.getByRole("textbox", { name: "archive confirmation" });
    fireEvent.change(input, { target: { value: "Test Content" } });
    expect(mockProps.handleArchiveContentChange).toHaveBeenCalled();
  });

  test("calls the archive handler on confirm button click", () => {
    render(<TestArchiveContentModal {...mockProps} />);
    const button = screen.getByText("confirm");
    fireEvent.click(button);
    expect(mockProps.handleArchiveContent).toHaveBeenCalled();
  });

  test("renders success message for step 2", () => {
    render(
      <TestArchiveContentModal
        {...mockProps}
        currentStepArchive={2}
      />
    );
    expect(
      screen.getByText("Archived ‘Test Content’ successfully.")
    ).toBeInTheDocument();
    const viewButton = screen.getByText("view archived contents");
    fireEvent.click(viewButton);
    expect(mockProps.setActiveButton).toHaveBeenCalledWith("archive");
    expect(mockProps.setIsArchiveContentModalOpen).toHaveBeenCalledWith(false);
  });

  test("closes the modal on overlay click", () => {
    render(<TestArchiveContentModal {...mockProps} />);
    const overlay = screen.getByRole("button", { name: "close icon" });
    fireEvent.click(overlay);
    expect(mockProps.closeArchiveContentModal).toHaveBeenCalled();
  });
});


const DeleteContentModal = ({
  isDeleteContentModalOpen,
  selectedRequest,
  deleteContent,
  currentStepDelete,
  closeDeleteContentModal,
  handleDeleteContentChange,
  handleDeleteContent,
}) => {
  return (
    isDeleteContentModalOpen &&
    selectedRequest && (
      <div className="modal_overlay" onClick={closeDeleteContentModal}>
        <div
          className="archive_and_delete_content_container"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="archive_and_delete_content_header">
            <button
              className="header_close_button"
              onClick={closeDeleteContentModal}
            >
              <img
                src="/close-icon.png" // Placeholder for the close icon
                className="header_close_icon"
                alt="close icon"
              />
            </button>
          </div>

          <div className="subheader_container">
            <img
              src="/delete-content-icon.png" // Placeholder for delete icon
              className="subheader_icon"
              alt="delete content icon"
            />
            <h2 className="subheader_description">delete content</h2>
          </div>

          {currentStepDelete === 1 && (
            <>
              <div className="archive_and_delete_content">
                <p className="archive_and_delete_confirmation">
                  Are you sure you want to delete ‘{selectedRequest.Title}’?
                  Type ‘{selectedRequest.Title}’ to confirm.
                </p>

                <div className="confirm_archive_and_delete_container">
                  <input
                    type="text"
                    name="contentID"
                    placeholder={selectedRequest.ContentID}
                    value={deleteContent.contentID}
                    onChange={handleDeleteContentChange}
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="delete"
                    id="delete"
                    value={deleteContent.delete}
                    onChange={handleDeleteContentChange}
                    className="confirm_textbox confirm"
                    aria-label="delete confirmation"
                  />
                  <button
                    className="confirm_button confirm"
                    onClick={handleDeleteContent}
                  >
                    confirm
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStepDelete === 2 && (
            <>
              <p className="archive_and_delete_confirmation">
                Deleted ‘{selectedRequest.Title}’ successfully.
              </p>

              <div className="view_button_container">
                <button className="view_archived_contents_button">
                  view deleted contents
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};


describe("Delete Content Modal", () => {
  const mockProps = {
    isDeleteContentModalOpen: true,
    selectedRequest: { Title: "Test Content", ContentID: "123" },
    deleteContent: { contentID: "123", delete: "" },
    currentStepDelete: 1,
    closeDeleteContentModal: jest.fn(),
    handleDeleteContentChange: jest.fn(),
    handleDeleteContent: jest.fn(),
  };

  test("renders the delete modal when open", () => {
    render(<DeleteContentModal {...mockProps} />);
    expect(screen.getByText("delete content")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete ‘Test Content’? Type ‘Test Content’ to confirm."
      )
    ).toBeInTheDocument();
  });

  test("handles input change for delete confirmation", () => {
    render(<DeleteContentModal {...mockProps} />);
    const input = screen.getByRole("textbox", { name: "delete confirmation" });
    fireEvent.change(input, { target: { value: "Test Content" } });
    expect(mockProps.handleDeleteContentChange).toHaveBeenCalled();
  });

  test("triggers delete confirmation button", () => {
    render(<DeleteContentModal {...mockProps} />);
    const button = screen.getByText("confirm");
    fireEvent.click(button);
    expect(mockProps.handleDeleteContent).toHaveBeenCalled();
  });

  test("closes the modal when clicking outside", () => {
    render(<DeleteContentModal {...mockProps} />);
    const overlay = screen.getByText("delete content").closest(".modal_overlay");
    fireEvent.click(overlay);
    expect(mockProps.closeDeleteContentModal).toHaveBeenCalled();
  });

 test("renders the success message on step 2", () => {
    render(
      <DeleteContentModal
        {...mockProps}
        currentStepDelete={2}
      />
    );
    expect(
      screen.getByText("Deleted ‘Test Content’ successfully.")
    ).toBeInTheDocument();
  });
});


