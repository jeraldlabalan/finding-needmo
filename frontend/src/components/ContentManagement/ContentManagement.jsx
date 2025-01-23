import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import styles from "./ContentManagement.module.css";
import logo from "../../assets/logo.png";
import add_content_icon from "../../assets/add-content-icon.png";
import file_icon_white from "../../assets/file-icon-white.png";
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
import unarchive_icon from "../../assets/unarchive-icon.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoutFunction from "../logoutFunction.jsx";
import Header from "../Header/Header.jsx";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip';

function ContentManagement() {
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    logoutFunction(navigate);
  };

  // Modal logic
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isArchiveContentModalOpen, setIsArchiveContentModalOpen] =
    useState(false);
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] =
    useState(false);
  const [currentStepDelete, setCurrentStepDelete] = useState(1);
  const [currentStepArchive, setCurrentStepArchive] = useState(1);
  const [confirmDeleteRows, setConfirmDeleteRows] = useState(false);

  // Search result header logic
  const [activeButton, setActiveButton] = useState("all");

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setUserEmail(res.data.email);
          setUserRole(res.data.role);
        } else {
          navigate("/registerlogin");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

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

  const closeEditContentModal = () => {
    setIsEditContentModalOpen(false);
  };

  const closeArchiveContentModal = () => {
    setIsArchiveContentModalOpen(false);
    setArchiveContent({
      archive: "",
    });

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

  const [uploadedPFP, setUploadedPFP] = useState(null);

  //get user pfp
  useEffect(() => {
    axios
      .get("http://localhost:8080/getProfile")
      .then((res) => {
        const { message, pfp } = res.data;
        if (message === "User profile fetched successfully") {
          setUploadedPFP(`http://localhost:8080/${pfp}`);
        } else {
          toast.error(message, {
            autoClose: 5000,
          });
        }
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 5000,
        });
      });
  }, []);

  const [uploadedContent, setUploadedContent] = useState([]);
  const [archivedContent, setArchivedContent] = useState([]);

  //fetch both uploaded and archived contents
  const fetchContents = () => {
    axios
      .get("http://localhost:8080/getUploadedContent/manageContent")
      .then((response) => {
        if (response.data.uploadedContent) {
          setUploadedContent(response.data.uploadedContent);
        }
      })
      .catch((error) => console.error("Error fetching content:", error));

    axios
      .get("http://localhost:8080/getArchivedContents/manageContent")
      .then((response) => {
        if (response.data.archivedRes) {
          setArchivedContent(response.data.archivedRes);
        }
      })
      .catch((error) => console.error("Error fetching content:", error));
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const [courses, setCourses] = useState([]);
  const [contentFiles, setContentFiles] = useState([]);
  const [contentDetails, setContentDetails] = useState({
    title: "",
    description: "",
    subject: "",
    program: "",
    course: "",
    keyword: "",
    contentInput: "",
  });

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState([]);

  const handleContentFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    setContentFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleContentFileRemove = (index) => {
    setContentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddContentChange = (e) => {
    const { name, value } = e.target;

    setContentDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };

      // Handle program change
      if (name === "program") {
        // Only clear subjects when the program is changed to a valid value
        if (value === null || value === "") {
          updatedDetails.subject = null; // Clear subject if program is reset
        }
      }

      return updatedDetails;
    });
  };

  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editContent, setEditContent] = useState({
    contentID: selectedRequest.ContentID,
    title: selectedRequest.Title,
    description: selectedRequest.Description,
    subject: selectedRequest.Course,
    program: selectedRequest.Program,
    course: selectedRequest.Course,
    courseTitle: selectedRequest.CourseTitle, // Add courseTitle
    keyword: selectedRequest.Tags,
    files: selectedRequest.Files, // Initialize files
  });

  const [editContentFiles, setEditContentFiles] = useState(
    selectedRequest.Files || []
  ); // Files for editing content

  const handleEditContentFiles = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    const newFiles = selectedFiles.map((file) => ({
      originalName: file.name,
      file: file, // Store the actual file object
      mimeType: file.type,
      size: file.size,
    }));

    setEditContentFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setEditContent((prevContent) => ({
      ...prevContent,
      files: [...prevContent.files, ...newFiles],
    }));
  };

  const handleEditContentFileRemove = (index) => {
    setEditContentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setEditContent((prevContent) => ({
      ...prevContent,
      files: prevContent.files.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (selectedRequest) {
      setEditContent({
        contentID: selectedRequest.ContentID,
        title: selectedRequest.Title,
        description: selectedRequest.Description,
        subject: selectedRequest.Course || "", // Always set this to a valid value (empty string if undefined)
        program: selectedRequest.Program,
        courseID: selectedRequest.Course || "", // Ensure this is set as well
        courseTitle: selectedRequest.CourseTitle, // Add courseTitle
        keyword: selectedRequest.Tags,
        files: Array.isArray(selectedRequest.Files)
          ? selectedRequest.Files
          : [], // Ensure files is an array
      });

      setEditContentFiles(
        Array.isArray(selectedRequest.Files) ? selectedRequest.Files : [] // Ensure files is an array
      );
    }
  }, [selectedRequest]);

  const handleEditContentChange = (e) => {
    const { name, value } = e.target;
    setEditContent((prevRequest) => ({
      ...prevRequest,
      [name]: value,
    }));
  };

  const handleAddContent = (e) => {
    e.preventDefault();

    // Validate the form fields
    if (
      !contentDetails.title ||
      !contentDetails.description ||
      !contentDetails.keyword ||
      contentDetails.program === "" ||
      contentDetails.subject === ""
    ) {
      // Display error toast if any field is missing
      toast.error("All fields are required");
      return; // Prevent submission
    }

    if (contentFiles.length === 0) {
      toast.error("At least one file must be added");
      return; // Prevent submission if no files
    }

    const formData = new FormData();
    contentFiles.forEach((contentFile) =>
      formData.append("contentFiles", contentFile)
    );
    formData.append("title", contentDetails.title);
    formData.append("description", contentDetails.description);
    formData.append("subject", contentDetails.subject);
    formData.append("program", contentDetails.program);
    formData.append("keyword", contentDetails.keyword);

    axios
      .post("http://localhost:8080/uploadContent", formData)
      .then((res) => {
        toast.success("Upload success", {
          autoClose: 1000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });
  };

  const handleEditContent = (e) => {
    e.preventDefault();

    if (!editContent.files || editContent.files.length === 0) {
      toast.error("At least one file must be added");
      return; // Prevent submission if no files are uploaded
    }

    const formData = new FormData();
    editContentFiles.forEach((editContentFile) => {
      if (editContentFile.file) {
        formData.append("editContentFiles", editContentFile.file); // Append the actual file object
      } else {
        formData.append("existingFiles", JSON.stringify(editContentFile)); // Append existing file metadata
      }
    });
    formData.append("contentID", editContent.contentID);
    formData.append("title", editContent.title);
    formData.append("course", editContent.course);
    formData.append("description", editContent.description);
    formData.append("subject", editContent.subject); // Ensure this is a valid CourseID
    formData.append("program", editContent.program);
    formData.append("keyword", editContent.keyword);

    axios
      .post("http://localhost:8080/editUploadedContent", formData)
      .then((res) => {
        toast.success("Edit success", {
          autoClose: 1000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.error("Edit error:", err);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/getContentPrograms")
      .then((res) => {
        setPrograms(res.data);
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 4000,
        });
      });
  }, []);

  useEffect(() => {
    if (editContent.program) {
      axios
        .get(
          `http://localhost:8080/getContentSubjects?program=${editContent.program}`
        )
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((err) => {
          toast.error("Error: " + err, {
            autoClose: 4000,
          });
        });
    }
  }, [editContent.program]);

  useEffect(() => {
    // If program is selected, filter the courses accordingly
    if (contentDetails.program) {
      const filtered = courses.filter(
        (course) => course.Program === parseInt(contentDetails.program)
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]); // Clear subjects when no program is selected
    }
  }, [contentDetails.program, courses]); // Run when program or courses change

  //get courses
  useEffect(() => {
    axios
      .get("http://localhost:8080/getCourses")
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 4000,
        });
      });
  }, []);

  const [archiveContent, setArchiveContent] = useState({
    contentID: "",
    archive: "",
  });
  const [isArchiveSuccess, setIsArchiveSuccess] = useState(false);

  const handleArchiveContentChange = (e) => {
    const { name, value } = e.target;
    setArchiveContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleArchiveContent = () => {
    if (!archiveContent.archive) {
      toast.error("Please enter a title", {
        autoClose: 2000,
      });
      return;
    }

    if (
      archiveContent.archive !== selectedRequest.Title ||
      !archiveContent.archive
    ) {
      toast.error("Title does not match", {
        autoClose: 2000,
      });
      return;
    }

    const data = {
      contentID: selectedRequest.ContentID,
      title: archiveContent.archive,
    };

    axios
      .post("http://localhost:8080/archiveUploadedContent", data)
      .then((res) => {
        toast.success("Archive success", {
          autoClose: 2000,
        });

        setCurrentStepArchive((prev) => (prev < 2 ? prev + 1 : prev));
        setIsArchiveSuccess(true);
        fetchContents();
      })
      .catch((err) => {
        console.error("Archive error:", err);
        setIsArchiveSuccess(false);
      });
  };

  const handleArchiveSelectedRows = () => {
    axios
      .post("http://localhost:8080/archiveSelectedRows", { selectedCards })
      .then((res) => {
        if (res.data.message === "Success") {
          toast.dismiss();
          window.location.reload();
        } else {
          toast.error(`Failed to archive selected contents`);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleUnarchiveSelectedRows = () => {
    axios
      .post("http://localhost:8080/unarchiveSelectedRows", { selectedCards })
      .then((res) => {
        if (res.data.message === "Success") {
          toast.dismiss();
          window.location.reload();
        } else {
          toast.error(`Failed to unarchive selected contents`);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleDeleteSelectedRows = () => {
    axios
      .post("http://localhost:8080/deleteSelectedRows", { selectedCards })
      .then((res) => {
        if (res.data.message === "Success") {
          toast.dismiss();
          window.location.reload();
        } else {
          toast.error(`Failed to delete selected contents`);
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const [deleteContent, setDeleteContent] = useState({
    contentID: "",
    delete: "",
  });

  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const handleDeleteContentChange = (e) => {
    const { name, value } = e.target;
    setDeleteContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleDeleteContent = () => {
    if (!deleteContent.delete) {
      toast.error("Please enter a title", {
        autoClose: 2000,
      });
      return;
    }

    if (
      deleteContent.delete !== selectedRequest.Title ||
      !deleteContent.delete
    ) {
      toast.error("Title does not match", {
        autoClose: 2000,
      });
      return;
    }

    const data = {
      contentID: selectedRequest.ContentID,
      title: deleteContent.delete,
    };

    axios
      .post("http://localhost:8080/deleteUploadedContent", data)
      .then((res) => {
        toast.success("Delete success", {
          autoClose: 2000,
        });

        setCurrentStepDelete((prev) => (prev < 2 ? prev + 1 : prev));
        setIsDeleteSuccess(true);
      })
      .catch((err) => {
        console.error("Archive error:", err);
        setIsDeleteSuccess(false);
      });
  };

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

  //handle unarchive a content
  const handleUnarchiveContent = (details) => {
    axios
      .post("http://localhost:8080/unarchiveContent", {
        contentID: details.ContentID,
        title: details.Title,
      })
      .then((res) => {
        if (res.data.message === "Success") {
          toast.success(`Successfully unarchived content: '${details.Title}'`, {
            autoClose: 500,
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast.error(`Failed to unarchive content: '${details.Title}'`, {
            autoClose: 2000,
          });
        }
      })
      .catch((err) => {
        toast.error(`An error occurred. Please try again.` + err, {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" />

      <ReactTooltip
        anchorId="edit"
        className="custom-tooltip"
        content='Edit Content'
        place="top"
        effect="solid"
        noArrow />

    <ReactTooltip
        anchorId="archive"
        className="custom-tooltip"
        content='Archive Content'
        place="top"
        effect="solid"
        noArrow />

    <ReactTooltip
        anchorId="delete"
        className="custom-tooltip"
        content='Delete Content'
        place="top"
        effect="solid"
        noArrow />

    <ReactTooltip
        anchorId="unarchive"
        className="custom-tooltip"
        content='Unarchive Content'
        place="top"
        effect="solid"
        noArrow />

      <div className={styles.search_history_header}>
        {/* I just imported the header here, idk if this is different from the previous one which is a hard code header, don't get mad if it is. */}

        <Header />
      </div>
      <Link className={styles.search_history_logo} to="/home">
        <img src={logo} className={styles.search_history_logo} alt="logo" />
      </Link>
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

          {confirmDeleteRows && (
            <div
              className={styles.modal_overlay}
              onClick={closeDeleteContentModal}
            >
              <div
                className={`${styles.archive_and_delete_content_container}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                {/* Modal Content Here */}

                <div className={styles.subheader_container}>
                  <img
                    src={delte_content_icon}
                    className={styles.subheader_icon}
                    alt="delete content icon"
                  />
                  <h2 className={styles.subheader_description}>
                    delete content
                  </h2>
                </div>

                <>
                  <p className={styles.archive_and_delete_confirmation}>
                    Are you sure you want to delete the selected contents? This
                    action is permanent and cannot be undone.
                  </p>

                  <div className={styles.view_button_container}>
                    <button
                      onClick={handleDeleteSelectedRows}
                      className={`${styles.view_archived_contents_button}`}
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setConfirmDeleteRows(false)}
                      style={{
                        textAlign: "center",
                        width: "100%",
                        marginTop: "10px",
                        background: "transparent",
                        fontSize: "1rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              </div>
            </div>
          )}

          {/* {confirmDeleteRows && (
        <>
        <p className={styles.archive_and_delete_confirmation}>
          Are you sure you want to delete the selected contents? This action is permanent and cannot be undone.
        </p>

        <div className={styles.view_button_container}>
          <button
            onClick={handleDeleteSelectedRows}
            className={`${styles.view_archived_contents_button}`}>
            Delete
          </button>

          <button
            onClick={()=>setConfirmDeleteRows(false)}
            className={`${styles.view_archived_contents_button}`}>
            Cancel
          </button>
        </div>
      </>
      )} */}
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
                {activeButton === "all" ? (
                  <>
                    <button
                      style={{ background: "transparent" }}
                      onClick={handleArchiveSelectedRows}
                    >
                      <img
                        className={styles.content_archive_button}
                        src={clock_back_icon}
                        alt="archive content"
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={{ background: "transparent" }}
                      onClick={handleUnarchiveSelectedRows}
                    >
                      <img
                        className={styles.content_archive_button}
                        src={unarchive_icon}
                        alt="unarchive content"
                      />
                    </button>
                  </>
                )}
                <button
                  style={{ background: "transparent" }}
                  onClick={() => setConfirmDeleteRows(true)}
                >
                  <img
                    className={styles.content_delete_button}
                    src={trash_icon}
                    alt="delete content"
                  />
                </button>
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
                                data-tooltip-id="edit"
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
                                data-tooltip-id="archive"
                              >
                                <img
                                  src={clock_back_icon}
                                  className={styles.action_icon}
                                  onClick={openArchiveContentModal}
                                  alt="clock back icon"
                                />
                              </button>

                              <button className={styles.action} data-tooltip-id="delete">
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
                {archivedContent.length > 0 ? (
                  archivedContent.map((details) => (
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
                                onClick={() => handleUnarchiveContent(details)}
                                data-tooltip-id="unarchive"
                              >
                                <img
                                  src={unarchive_icon}
                                  className={styles.action_icon}
                                  alt="unarchive icon"
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
                  <p>No archived content found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

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
                  <button className={styles.add_file_button_container}>
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
                    add files
                  </button>
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
                value={editContent.subject || ""}
                onChange={handleEditContentChange}
                className={`${styles.modal_content_input} ${styles.modal_content_select}`}
              >
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
                  <button className={styles.add_file_button_container}>
                    <input
                      name="contentInput"
                      value={contentDetails.contentInput}
                      type="file"
                      multiple
                      onChange={handleEditContentFiles}
                    />
                    <img
                      src={add_file_icon}
                      className={styles.file_icon}
                      alt="add file icon"
                    />
                    add files
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
                    Are you sure you want to archive ‘
                    <strong className={styles.boldText}>
                      {selectedRequest.Title}
                    </strong>
                    ’? Type ‘
                    <strong className={styles.boldText}>
                      {selectedRequest.Title}
                    </strong>
                    ’ to confirm.
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
                  Archived{" "}
                  <strong className={styles.boldText}>
                    ‘{selectedRequest.Title}’
                  </strong>{" "}
                  successfully.
                </p>
                <div className={styles.view_button_container}>
                  <button
                    onClick={closeArchiveContentModal}
                    className={`${styles.view_archived_contents_button}`}
                  >
                    Done
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
                    Are you sure you want to delete ‘
                    <strong className={styles.boldText}>
                      {selectedRequest.Title}
                    </strong>
                    ’? Type ‘
                    <strong className={styles.boldText}>
                      {selectedRequest.Title}
                    </strong>
                    ’ to confirm.
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
                  Deleted{" "}
                  <strong className={styles.boldText}>
                    ‘{selectedRequest.Title}’
                  </strong>{" "}
                  successfully.
                </p>

                <div className={styles.view_button_container}>
                  <button
                    onClick={closeDeleteContentModal}
                    className={`${styles.view_archived_contents_button}`}
                  >
                    Done
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
