import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import styles from "./ContentManagement.module.css";
import uploadedPFP from "../../assets/default-profile-photo.jpg";
import profile from "../../assets/profile.jpg";
import search_history from "../../assets/search-history.jpg";
import account_settings from "../../assets/account-settings.jpg";
import manage_content from "../../assets/manage-content.jpg";
import logout from "../../assets/logout.jpg";
import logo from "../../assets/logo.png";
import edit_icon from "../../assets/edit-icon.png";
import clock_back_icon from "../../assets/clock-back-icon.png";
import delete_icon from "../../assets/delete-icon.png";
import modal_close_icon from "../../assets/close-icon-modal.png";
import edit_content_icon from "../../assets/edit-content-icon.png";
import archive_content_icon from "../../assets/archive-content-icon.png";
import delte_content_icon from "../../assets/delete-content-icon.png";
import add_file_icon from "../../assets/add-file-icon.png";
import delete_file_icon_white from "../../assets/delete-file-icon-white.png";
import add from "../../assets/add.png";
import multiple_select_icon from "../../assets/multiple-select.png";
import close from "../../assets/close-icon-modal.png";
import trash_icon from "../../assets/trash-icon-blue.png";
import unarchive_icon from "../../assets/unarchive-icon.png"

function ContentManagement() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const [isMultipleSelect, setIsMultipleSelect] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleMultipleSelectClick = () => {
    setIsMultipleSelect(true);
  };

  const handleBackClick = () => {
    setIsMultipleSelect(false);
    setSelectedCards([]);
  };

  const handleCardSelect = (contentID) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(contentID)
        ? prevSelected.filter((id) => id !== contentID)
        : [...prevSelected, contentID]
    );
  };

  const handleLogout = () => {
    // Implement logout functionality here
    logoutFunction(navigate);
  };

  // Modal logic
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isArchiveContentModalOpen, setIsArchiveContentModalOpen] =
    useState(false);
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] =
    useState(false);
  const [currentStepDelete, setCurrentStepDelete] = useState(1);
  const [currentStepArchive, setCurrentStepArchive] = useState(1);

  // Search result header logic
  const [activeButton, setActiveButton] = useState("all");

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Sample artificial content
  const uploadedContent = [
    {
      ContentID: 1,
      Title: "Sample Content 1",
      CourseTitle: "Course 1",
      Program: 1, // Added program field
    },
    {
      ContentID: 2,
      Title: "Sample Content 2",
      CourseTitle: "Course 2",
      Program: 1, // Added program field
    },
    {
      ContentID: 3,
      Title: "Sample Content 3",
      CourseTitle: "Course 3",
      Program: 2, // Added program field
    },
  ];

  const handleEditRow = (details) => {
    setSelectedRequest({
      ...details,
      files: details.Files,
    });
    setIsEditContentModalOpen(true);
  };

  const handleArchiveRow = (details) => {
    setSelectedRequest({
      ...details,
      files: details.Files,
    });
    setIsArchiveContentModalOpen(true);
    toast.dismiss();
  };

  const handleDeleteRow = (details) => {
    setSelectedRequest({
      ...details,
      files: details.Files,
    });
    setIsDeleteContentModalOpen(true);
  };

  // Function to open the modals

  const openEditContentModal = () => {
    setIsEditContentModalOpen(true);
  };

  const openArchiveContentModal = () => {
    setIsArchiveContentModalOpen(true);
  };

  const openAddContentModal = () => {
    setIsAddContentModalOpen(true);
  };

  // Function to close the modals
  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const closeEditContentModal = () => {
    setIsEditContentModalOpen(false);
  };

  const closeArchiveContentModal = () => {
    setIsArchiveContentModalOpen(false);
    if (isArchiveSuccess) {
      window.location.reload();
    }
  };

  const closeAddContentModal = () => {
    setIsAddContentModalOpen(false);
  };

  const closeDeleteContentModal = () => {
    setIsDeleteContentModalOpen(false);
    if (isDeleteSuccess) {
      window.location.reload();
    }
  };

  return (
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
                <Link to="/profile">
                  <img
                    src={profile}
                    className={styles.dropdown_menu_logo}
                    alt="Profile"
                  />
                  Profile
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/search-history"
                    ? styles.active_link
                    : ""
                }
              >
                <Link to="/search-history">
                  <img
                    src={search_history}
                    className={styles.dropdown_menu_logo}
                    alt="Search History"
                  />
                  Search History
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/settings" ? styles.active_link : ""
                }
              >
                <Link to="/settings">
                  <img
                    src={account_settings}
                    className={styles.dropdown_menu_logo}
                    alt="Account Settings"
                  />
                  Account Settings
                </Link>
              </li>

              <li
                className={
                  location.pathname === "/settings" ? styles.active_link : ""
                }
              >
                <Link to="/settings">
                  <img
                    src={manage_content}
                    className={styles.dropdown_menu_logo}
                    alt="Manage Content"
                  />
                  Manage Content
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout}>
                  <img
                    src={logout}
                    className={styles.dropdown_menu_logo}
                    alt="Logout"
                  />
                  Logout
                </Link>
              </li>
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
              <>
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
              </>
            )}
          </div>
          <div className={styles.search_history_content_manipulation}>
            {!isMultipleSelect ? (
              <>
                <img
                  className={styles.content_add_button}
                  src={add}
                  alt="add content"
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

        <div className={styles.search_history_content}>
          {activeButton === "all" && (
            <>
              <div className={styles.content_cards}>
                {uploadedContent.length > 0 ? (
                  uploadedContent.map((details) => (
                    <div
                      className={`${styles.card} ${
                        isMultipleSelect &&
                        selectedCards.includes(details.ContentID)
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
                        <p className={styles.card_subtitle}>
                          {details.CourseTitle}
                        </p>
                      </div>

                      <div className={styles.card_action_container}>
                        {!isMultipleSelect ? (
                          <>
                            <div className={styles.card_actions}>
                              <button
                                onClick={() => handleEditRow(details)}
                                className={styles.action}
                              >
                                <img
                                  src={edit_icon}
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
                                  src={clock_back_icon}
                                  className={styles.action_icon}
                                  onClick={openArchiveContentModal}
                                  alt="clock back icon"
                                />
                              </button>

                              <button className={styles.action}>
                                <img
                                  src={delete_icon}
                                  className={styles.action_icon}
                                  alt="delete icon"
                                  onClick={() => handleDeleteRow(details)}
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
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
            </>
          )}



          {activeButton === "archive" && (
            <>
              <div className={styles.content_cards}>
                {uploadedContent.length > 0 ? (
                  uploadedContent.map((details) => (
                    <div
                      className={`${styles.card} ${
                        isMultipleSelect &&
                        selectedCards.includes(details.ContentID)
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
                        <p className={styles.card_subtitle}>
                          {details.CourseTitle}
                        </p>
                      </div>

                      <div className={styles.card_action_container}>
                        {!isMultipleSelect ? (
                          <>
                            <div className={styles.card_actions}>
                              <button
                                className={styles.action}
                              >
                                <img
                                  src={unarchive_icon}
                                  className={styles.action_icon}
                                  alt="edit icon"
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
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
            </>
          )}
        </div>
      </div>

      {/* EDIT PROFILE Modal */}
      {isEditProfileModalOpen && (
        <div className={styles.modal_overlay} onClick={closeEditProfileModal}>
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className={styles.modal_header}>
              <h2 className={styles.header_title}>Edit Profile</h2>
              <button
                className={styles.header_close_button}
                onClick={closeEditProfileModal}
              >
                <img
                  src={modal_close_icon}
                  className={styles.header_close_icon}
                  alt="close icon"
                />
              </button>
            </div>

            <div className={styles.modal_profile_container}>
              <div className={styles.profile_container}>
                <img
                  src={profileInfo.uploadPFP ? profileInfo.pfpURL : uploadedPFP}
                  className={styles.modal_profile_photo}
                  alt="profile photo"
                />
                <input
                  type="file"
                  id="uploadPFP"
                  name="uploadPFP"
                  className={styles.edit_profile_photo_button}
                  accept="image/*"
                  onChange={handleUploadChange}
                />
                <img
                  src={edit_profile_icon}
                  className={styles.edit_profile_icon}
                  alt="edit profile photo icon"
                />
              </div>
            </div>

            <div className={styles.modal_info_container}>
              <div className={styles.modal_info_group}>
                <div className={styles.name_container}>
                  <input
                    type="text"
                    name="firstName"
                    id="firstname"
                    value={profileInfo.firstName}
                    placeholder="First name"
                    className={styles.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={profileInfo.lastName}
                    id="lastName"
                    placeholder="Last name"
                    className={styles.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <select
                  name="position"
                  className={styles.modal_info_input}
                  id="position"
                  onChange={handleInputChange}
                  value={profileInfo.position || ""}
                  required
                >
                  <option value={null}>Your position</option>
                  <option value="Instructor 1">Instructor 1</option>
                  <option value="Instructor 2">Instructor 2</option>
                  <option value="Instructor 3">Instructor 3</option>
                </select>

                <select
                  name="program"
                  className={styles.modal_info_input}
                  id="program"
                  onChange={handleInputChange}
                  value={profileInfo.program || null}
                  required
                >
                  <option value={null}>Select Program</option>
                  <option value="1">
                    Bachelor of Science in Computer Science
                  </option>
                  <option value="2">
                    Bachelor of Science in Information Technology
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.save_changes_button_container}>
              <button
                onClick={saveProfileChanges}
                className={styles.save_changes_button}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD Content Modal */}
      {isAddContentModalOpen && (
        <div className={styles.modal_overlay} onClick={closeAddContentModal}>
          <div
            className={`${styles.modal_content} ${styles.modal_content_container}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Modal Content Here */}

            <div className={styles.modal_content_header}>
              <button
                className={styles.header_close_button}
                onClick={closeAddContentModal}
              >
                <img
                  src={modal_close_icon}
                  className={styles.header_close_icon}
                  alt="close icon"
                />
              </button>
            </div>
            <div className={styles.modal_content_info_container}>
              <div className={styles.subheader_container}>
                <img
                  src={add_content_icon}
                  className={styles.subheader_icon}
                  alt="add content icon"
                />
                <h2 className={styles.subheader_description}>add content</h2>
              </div>

              <input
                type="text"
                className={`${styles.modal_content_input} ${styles.modal_content_text}`}
                name="title"
                id="title"
                placeholder="Title"
                value={contentDetails.title}
                onChange={handleAddContentChange}
              />

              <textarea
                name="description"
                id="description"
                className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                placeholder="Write description here..."
                value={contentDetails.description}
                onChange={handleAddContentChange}
              ></textarea>

              <select
                name="program"
                id="program"
                className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                value={contentDetails.program}
                onChange={handleAddContentChange}
              >
                <option value={null}>Program</option>
                <option value="1">Computer Science</option>
                <option value="2">Information Technology</option>
              </select>

              <select
                name="subject"
                id="subject"
                className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                value={contentDetails.subject}
                onChange={handleAddContentChange}
              >
                <option value={null}>Subject</option>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects
                    .sort((a, b) => a.Title.localeCompare(b.Title)) // Sort alphabetically
                    .map((course) => (
                      <option value={course.CourseID} key={course.CourseID}>
                        {course.Title} {/* Display course title */}
                      </option>
                    ))
                ) : (
                  <option disabled>No subjects available</option> // Fallback message
                )}
              </select>

              <textarea
                name="keyword"
                id="keyword"
                value={contentDetails.keyword}
                onChange={handleAddContentChange}
                placeholder="Write keywords here (e.g. webdev, appdev, gamedev)..."
                className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
              ></textarea>

              <div className={styles.modal_file_container}>
                {" "}
                {/* Dito yung mga uploaded files */}
                {contentFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`${styles.file} ${
                      index % 2 === 0
                        ? styles.file_icon_white
                        : styles.file_icon_black
                    }`}
                  >
                    <img
                      src={file_icon_white} // Use appropriate file icon
                      className={styles.file_icon}
                      alt="file icon"
                    />
                    <p className={styles.file_name}>{file.name}</p>{" "}
                    {/* Display file name */}
                    <img
                      src={delete_file_icon_white} // Use appropriate delete icon
                      className={styles.file_icon}
                      alt="remove file icon"
                      onClick={() => handleContentFileRemove(index)} // Remove file
                    />
                  </div>
                ))}
                <div className={`${styles.file} ${styles.add_file}`}>
                  <input
                    name="contentInput"
                    value={contentDetails.contentInput}
                    type="file"
                    multiple
                    onChange={handleContentFileChange}
                  />
                  <img
                    src={add_file_icon}
                    className={styles.file_icon}
                    alt="add file icon"
                  />
                  <p className={styles.button_name}>add files</p>
                </div>
              </div>
            </div>
            <div className={styles.save_changes_button_container}>
              <button
                className={styles.save_changes_button}
                onClick={handleAddContent}
              >
                add content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Content Modal */}
      {isEditContentModalOpen && selectedRequest && (
        <div className={styles.modal_overlay} onClick={closeEditContentModal}>
          <div
            className={`${styles.modal_content} ${styles.modal_content_container}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className={styles.modal_content_header}>
              <button
                className={styles.header_close_button}
                onClick={closeEditContentModal}
              >
                <img
                  src={modal_close_icon}
                  className={styles.header_close_icon}
                  alt="close icon"
                />
              </button>
            </div>
            <div className={styles.modal_content_info_container}>
              <div className={styles.subheader_container}>
                <img
                  src={edit_content_icon}
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
                style={{ display: "none" }} // Hide the input field
              />

              <input
                type="text"
                className={`${styles.modal_content_input} ${styles.modal_content_text}`}
                name="title"
                id="title"
                placeholder="Title"
                value={editContent.title}
                onChange={handleEditContentChange}
              />

              <textarea
                name="description"
                id="description"
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
                    {program.Name === "Bachelor of Science in Computer Science"
                      ? "Computer Science"
                      : program.Name ===
                        "Bachelor of Science in Information Technology"
                      ? "Information Technology"
                      : ""}
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
                  subjects
                    .sort((a, b) => a.Title.localeCompare(b.Title)) // Sort alphabetically
                    .map((course) => (
                      <option value={course.CourseID} key={course.CourseID}>
                        {course.Title} {/* Display course title */}
                      </option>
                    ))
                ) : (
                  <option disabled>No subjects available</option> // Fallback message
                )}
              </select>

              <textarea
                name="keyword"
                id="keyword"
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
                        src={file_icon_white} // Use appropriate file icon
                        className={styles.file_icon}
                        alt="file icon"
                      />
                      <p className={styles.file_name}>{file.originalName}</p>{" "}
                      {/* Display file name */}
                      <img
                        src={delete_file_icon_white} // Use appropriate delete icon
                        className={styles.file_icon}
                        alt="remove file icon"
                        onClick={() => handleEditContentFileRemove(index)} // Remove file
                      />
                    </div>
                  ))}
                <div className={`${styles.file} ${styles.add_file}`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleEditContentFiles}
                  />
                  <img
                    src={add_file_icon}
                    className={styles.file_icon}
                    alt="add file icon"
                  />
                  <p className={styles.button_name}>add files</p>
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

      {/* ARCHIVE Content Modal */}
      {isArchiveContentModalOpen && selectedRequest && (
        <div
          className={styles.modal_overlay}
          onClick={closeArchiveContentModal}
        >
          <div
            className={`${styles.archive_and_delete_content_container}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Modal Content Here */}

            <div className={styles.archive_and_delete_content_header}>
              <button
                className={styles.header_close_button}
                onClick={closeArchiveContentModal}
              >
                <img
                  src={modal_close_icon}
                  className={styles.header_close_icon}
                  alt="close icon"
                />
              </button>
            </div>

            <div className={styles.subheader_container}>
              <img
                src={archive_content_icon}
                className={styles.subheader_icon}
                alt="archive content icon"
              />
              <h2 className={styles.subheader_description}>archive content</h2>
            </div>

            {currentStepArchive === 1 && (
              <>
                <div className={styles.archive_and_delete_content}>
                  <p className={styles.archive_and_delete_confirmation}>
                    Are you sure you want to archive ‘{selectedRequest.Title}’?
                    Type ‘{selectedRequest.Title}’ to confirm.
                  </p>

                  <div className={styles.confirm_archive_and_delete_container}>
                    <input
                      type="text"
                      name="contentID"
                      onChange={handleArchiveContentChange}
                      placeholder={selectedRequest.ContentID}
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
                    />
                    <button
                      className={`${styles.confirm_button} ${styles.confirm}`}
                      onClick={handleArchiveContent}
                    >
                      confirm
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStepArchive === 2 && (
              <>
                <p className={styles.archive_and_delete_confirmation}>
                  Archived ‘{selectedRequest.Title}’ successfully.
                </p>

                <div className={styles.view_button_container}>
                  <button className={`${styles.view_archived_contents_button}`}>
                    view archived contents
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Content Modal */}
      {isDeleteContentModalOpen && selectedRequest && (
        <div className={styles.modal_overlay} onClick={closeDeleteContentModal}>
          <div
            className={`${styles.archive_and_delete_content_container}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Modal Content Here */}

            <div className={styles.archive_and_delete_content_header}>
              <button
                className={styles.header_close_button}
                onClick={closeDeleteContentModal}
              >
                <img
                  src={modal_close_icon}
                  className={styles.header_close_icon}
                  alt="close icon"
                />
              </button>
            </div>

            <div className={styles.subheader_container}>
              <img
                src={delte_content_icon}
                className={styles.subheader_icon}
                alt="delete content icon"
              />
              <h2 className={styles.subheader_description}>delete content</h2>
            </div>

            {currentStepDelete === 1 && (
              <>
                <div className={styles.archive_and_delete_content}>
                  <p className={styles.archive_and_delete_confirmation}>
                    Are you sure you want to delete ‘{selectedRequest.Title}’?
                    Type ‘{selectedRequest.Title}’ to confirm.
                  </p>

                  <div className={styles.confirm_archive_and_delete_container}>
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
                      className={`${styles.confirm_textbox} ${styles.confirm}`}
                    />
                    <button
                      className={`${styles.confirm_button} ${styles.confirm}`}
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
                <p className={styles.archive_and_delete_confirmation}>
                  Deleted ‘{selectedRequest.Title}’ successfully.
                </p>

                <div className={styles.view_button_container}>
                  <button className={`${styles.view_archived_contents_button}`}>
                    view deleted contents
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentManagement;
