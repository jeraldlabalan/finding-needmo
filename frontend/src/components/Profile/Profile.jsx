import React, { useState, useEffect } from 'react';
import styles from "./Profile.module.css";
import Header from "../Header/Header";
import default_photo from "../../assets/default-profile-photo.jpg";
import role_icon from "../../assets/role-icon.png";
import information_icon from "../../assets/information-icon.png";
import edit_icon from "../../assets/edit-icon.png";
import clock_back_icon from "../../assets/clock-back-icon.png";
import delete_icon from "../../assets/delete-icon.png";
import modal_close_icon from "../../assets/close-icon-modal.png";
import edit_profile_icon from "../../assets/edit-profile-icon.png";
import add_content_icon from "../../assets/add-content-icon.png";
import edit_content_icon from "../../assets/edit-content-icon.png";
import archive_content_icon from "../../assets/archive-content-icon.png";
import delte_content_icon from "../../assets/delete-content-icon.png";
import file_icon_white from "../../assets/file-icon-white.png";
import file_icon_black from "../../assets/file-icon-black.png";
import add_file_icon from "../../assets/add-file-icon.png";
import delete_file_icon_black from "../../assets/delete-file-icon-black.png";
import delete_file_icon_white from "../../assets/delete-file-icon-white.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  // Modal logic
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isArchiveContentModalOpen, setIsArchiveContentModalOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] = useState(false);
  const [currentStepDelete, setCurrentStepDelete] = useState(1);
  const [currentStepArchive, setCurrentStepArchive] = useState(1);

  const [csContributions, setCSContributions] = useState(0);
  const [itContributions, setITContributions] = useState(0);

  const [userEmail, setUserEmail] = useState("");
  const [userColumns, setUserColumns] = useState([]);
  const [profileColumns, setProfileColumns] = useState([]);
  const [uploadedPFP, setUploadedPFP] = useState(null);

  const [profileInfo, setProfileInfo] = useState({
    uploadPFP: null,
    pfpURL: '',
    firstName: '',
    lastName: '',
    position: '',
    program: '',
  });

  const [courses, setCourses] = useState([]);
  const [contentFiles, setContentFiles] = useState([]);
  const [contentDetails, setContentDetails] = useState({
    title: '',
    description: '',
    subject: '',
    program: '',
    course: '',
    keyword: '',
  });

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState([]);

  const [uploadedContent, setUploadedContent] = useState([]);

  useEffect(() => {
    // Fetch the uploaded content data
    axios.get('http://localhost:8080/getUploadedContent')
      .then(response => {
        if (response.data.uploadedContent) {
          setUploadedContent(response.data.uploadedContent);
        }
        console.log(response.data);
      })
      .catch(error => console.error("Error fetching content:", error));
  }, []);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setUserEmail(res.data.email);
        } else {
          navigate("/registerlogin");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

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

  const handleAddContent = (e) => {
    e.preventDefault();

    const formData = new FormData();
    contentFiles.forEach((contentFile) => formData.append("contentFiles", contentFile));
    formData.append("title", contentDetails.title);
    formData.append("description", contentDetails.description);
    formData.append("subject", contentDetails.subject);
    formData.append("program", contentDetails.program);
    formData.append("keyword", contentDetails.keyword);

    axios
      .post("http://localhost:8080/uploadContent", formData)
      .then((res) => {
        console.log("Upload success:", res.data);
        toast.success("Upload success", {
          autoClose: 2000
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });

  };

  useEffect(() => {

    // If program is selected, filter the courses accordingly
    if (contentDetails.program) {
      const filtered = courses.filter(
        (course) => course.Program === parseInt(contentDetails.program)
      );
      console.log("Filtered Subjects:", filtered);
      setFilteredSubjects(filtered);
    } else {
      console.log("Program not selected, clearing subjects...");
      setFilteredSubjects([]); // Clear subjects when no program is selected
    }
  }, [contentDetails.program, courses]); // Run when program or courses change


  //get courses
  useEffect(() => {
    axios.get("http://localhost:8080/getCourses")
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 4000
        })
      })
  }, []);


  useEffect(() => {
    axios.get("http://localhost:8080/getEduContributions")
      .then((res) => {
        if (res.data.message === "Contributions fetched") {
          setCSContributions(res.data.csCount);
          setITContributions(res.data.itCount);
        }
      })
  })

  useEffect(() => {
    axios.get('http://localhost:8080/getProfile')
      .then((res) => {
        const { message, pfp, userData, profileData } = res.data;
        if (message === "User profile fetched successfully") {
          setUserColumns(userData);
          setProfileColumns(profileData);
          setUploadedPFP(pfp);

          setProfileInfo({
            uploadPFP: pfp || null,
            pfpURL: pfp || '',
            firstName: profileData.Firstname || '',
            lastName: profileData.Lastname || '',
            position: profileData.Position || '',
            program: profileData.Program || '',
          });
        } else {
          toast.error(message, {
            autoClose: 5000
          })
        }
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 5000
        })
      })
  }, []);

  const saveProfileChanges = () => {
    const data = new FormData();
    if (profileInfo.uploadPFP) {
      data.append("uploadPFP", profileInfo.uploadPFP);
    }
    data.append("pfpURL", profileInfo.pfpURL);
    data.append("firstName", profileInfo.firstName);
    data.append("lastName", profileInfo.lastName);
    data.append("position", profileInfo.position);
    data.append("program", profileInfo.program || null);


    axios.post("http://localhost:8080/saveEducProfileChanges", data, {
      headers: { "Content-Type": "multipart/form-data", },
    })
      .then((res) => {
        if (res.data.message === "Changes saved") {
          console.log("Changes saved:", res.data);
          setUploadedPFP(`http://localhost:8080/${res.data.pfpURL}`);

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 5000
        })
      })
  }

  const nextStepArchive = () => {
    setCurrentStepArchive((prev) => (prev < 2 ? prev + 1 : prev));
  };

  const nextStepDelete = () => {
    setCurrentStepDelete((prev) => (prev < 2 ? prev + 1 : prev));
  };

  // Function to open the modals
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  const openEditContentModal = () => {
    setIsEditContentModalOpen(true);
  };

  const openArchiveContentModal = () => {
    setIsArchiveContentModalOpen(true);
  };

  const openAddContentModal = () => {
    setIsAddContentModalOpen(true);
  };

  const openDeleteContentModal = () => {
    setIsDeleteContentModalOpen(true)
  }

  // Function to close the modals
  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const closeEditContentModal = () => {
    setIsEditContentModalOpen(false);
  };

  const closeArchiveContentModal = () => {
    setIsArchiveContentModalOpen(false);
  };

  const closeAddContentModal = () => {
    setIsAddContentModalOpen(false);
  };

  const closeDeleteContentModal = () => {
    setIsDeleteContentModalOpen(false);
  }

  // Function to handle the file upload change
  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Create a URL for the selected image
      setProfileInfo(prevState => ({
        ...prevState,
        uploadPFP: file,   // Store the file itself
        pfpURL: url,       // Store the image URL for previewing
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileInfo((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update state
    }));
  };

  const handleRowClick = (details) => {
    setSelectedRequest(details);
    setIsEditContentModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <ToastContainer position='top-center' />
      <div className={styles.header_container}>
        <Header />
      </div>

      <div className={styles.content}>
        <div className={styles.upper_content}>
          <div className={styles.profile_photo_container}>
            <img src={uploadedPFP} alt="profile photo" />
          </div>
          <div className={styles.name_and_role_container}>
            <h1 className={styles.name}>{profileColumns.Firstname} {profileColumns.Lastname}</h1>
            <div className={styles.role_container}>
              <img
                src={role_icon}
                className={styles.role_icon}
                alt="role icon"
              />
              <span className={styles.role}>{userColumns.Role}</span>
            </div>
          </div>
        </div>

        <div className={styles.lower_content}>
          <div className={styles.contributions_and_about_container}>
            <div className={styles.contributions_container}>
              <h3>contributions</h3>
              <div className={styles.contributions_counts}>
                <div className={styles.counts_group}>
                  <p className={styles.count_title}>information technology</p>
                  <h3 className={styles.count}>{itContributions}</h3>
                </div>
                <div className={styles.counts_group}>
                  <p className={styles.count_title}>computer science</p>
                  <h3 className={styles.count}>{csContributions}</h3>
                </div>
              </div>
            </div>
            <div className={styles.about_container}>
              <h3>about</h3>
              <div className={styles.about_info_container}>
                <div className={styles.info_group}>
                  <img
                    src={information_icon}
                    className={styles.information_icon}
                    alt="information icon"
                  />
                  <p className={styles.info}>
                    {profileColumns.Position === null ? "______" : profileColumns.Position} at
                    <span className={styles.bolded_text}>
                      Cavite State University
                    </span>
                  </p>
                </div>

                <div className={styles.info_group}>
                  <img
                    src={information_icon}
                    className={styles.information_icon}
                    alt="information icon"
                  />
                  <p className={styles.info}>
                    Bachelor of Science in
                    <span className={styles.bolded_text}>{profileColumns.Program === 1 ? "Computer Science"
                      : profileColumns.Program === 2 ? "Information Technology"
                        : "_______"}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.edit_profile_button_container}>
              <button
                onClick={openEditProfileModal}
                className={styles.edit_profile_button}
              >
                edit profile
              </button>
            </div>
          </div>

          <div className={styles.content_container}>
            <div className={styles.content_heading}>
              <h3>content</h3>
              <button
                className={styles.add_content_button}
                onClick={openAddContentModal}
              >
                add content
              </button>
            </div>

            <div className={styles.content_cards_container}>
              <div className={styles.content_cards}>

                {uploadedContent.length > 0 ? (
                  uploadedContent.map(details => (
                    <div className={styles.card} key={details.ContentID}>
                      <div className={styles.card_info}>
                        <h4 className={styles.card_title}>{details.Title}</h4>
                        <p className={styles.card_subtitle}>
                          {details.CourseTitle}
                        </p>
                      </div>

                      <div className={styles.card_action_container}>
                        <div className={styles.card_actions}>
                          <button onClick={() => handleRowClick(details)} className={styles.action}>
                            <img
                              src={edit_icon}
                              className={styles.action_icon}
                              onClick={openEditContentModal}
                              alt="edit icon"
                            />
                          </button>

                          <button className={styles.action}>
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
                              onClick={openDeleteContentModal}
                            />
                          </button>
                        </div>
                        <span className={details.Program === 1 ? styles.program_cs
                        : details.Program === 2 ? styles.program_it : ""}>
                          {details.Program === 1 ? "Computer Science" 
                        : details.Program === 2 ? "Information Technology" : ""}</span>
                      </div>
                    </div>
                  ))) : (<p>No uploaded content found.</p>)}
                
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
                    <button className={styles.header_close_button} onClick={closeEditProfileModal}>
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
                        value={profileInfo.position || ''}
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
                        <option value="1">Bachelor of Science in Computer Science</option>
                        <option value="2">Bachelor of Science in Information Technology</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.save_changes_button_container}>
                    <button onClick={saveProfileChanges} className={styles.save_changes_button}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* ADD Content Modal */}
            {isAddContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeAddContentModal}
              >
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
                      <h2 className={styles.subheader_description}>
                        add content
                      </h2>
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
                      <option value="2">
                        Information Technology
                      </option>
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
                          className={`${styles.file} ${index % 2 === 0 ? styles.file_icon_white : styles.file_icon_black}`}
                        >
                          <img
                            src={file_icon_white} // Use appropriate file icon
                            className={styles.file_icon}
                            alt="file icon"
                          />
                          <p className={styles.file_name}>{file.name}</p> {/* Display file name */}
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
                    <button className={styles.save_changes_button} onClick={handleAddContent}>
                      add content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT Content Modal */}
            {isEditContentModalOpen && selectedRequest && (
              <div
                className={styles.modal_overlay}
                onClick={closeEditContentModal}
              >
                <div
                  className={`${styles.modal_content} ${styles.modal_content_container}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

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
                      <h2 className={styles.subheader_description}>
                        Edit Content
                      </h2>
                    </div>

                    <input
                      type="text"
                      className={`${styles.modal_content_input} ${styles.modal_content_text}`}
                      name="title"
                      id="title"
                      placeholder="Title"
                      value={selectedRequest.Title}
                    />

                    <textarea
                      name="description"
                      id="description"
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                      placeholder="Write description here..."
                      value={selectedRequest.Description}
                    ></textarea>

                    <select
                      name="program"
                      id="program"
                      onChange={handleAddContentChange}
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value={selectedRequest.Program}>{selectedRequest.Program === 1 ? "Computer Science"
                      : selectedRequest.Program === 2 ? "Information Technology" : ""}</option>
                      <option value="1">Computer Science</option>
                      <option value="2">
                        Information Technology
                      </option>
                    </select>

                    <select
                      name="subject"
                      id="subject"
                      onChange={handleAddContentChange}
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value={selectedRequest.Course}>{selectedRequest.CourseTitle}</option>
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
                      placeholder="Write keywords here..."
                      value={selectedRequest.Tags}
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                    ></textarea>

                    <div className={styles.modal_file_container}>
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>



                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>


                      <div className={`${styles.file} ${styles.add_file}`}>
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
                    <button className={styles.save_changes_button}>
                      add content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ARCHIVE Content Modal */}
            {isArchiveContentModalOpen && (
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
                    <h2 className={styles.subheader_description}>
                      archive content
                    </h2>
                  </div>

                  {currentStepArchive === 1 && (
                    <>
                      <div className={styles.archive_and_delete_content}>
                        <p className={styles.archive_and_delete_confirmation}>
                          Are you sure you want to archive ‘Arrays’? Type
                          ‘Arrays’ to confirm.
                        </p>

                        <div
                          className={
                            styles.confirm_archive_and_delete_container
                          }
                        >
                          <input
                            type="text"
                            name="archive"
                            id="archive"
                            className={`${styles.confirm_textbox} ${styles.confirm}`}
                          />
                          <button
                            className={`${styles.confirm_button} ${styles.confirm}`}
                            onClick={nextStepArchive}
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
                        Archived ‘Arrays’ successfully.
                      </p>

                      <div className={styles.view_button_container}>
                        <button
                          className={`${styles.view_archived_contents_button}`}
                        >
                          view archived contents
                        </button>
                      </div>

                    </>
                  )}
                </div>
              </div>
            )}


            {/* Delete Content Modal */}
            {isDeleteContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeDeleteContentModal}
              >
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
                    <h2 className={styles.subheader_description}>
                      delete content
                    </h2>
                  </div>

                  {currentStepDelete === 1 && (
                    <>
                      <div className={styles.archive_and_delete_content}>
                        <p className={styles.archive_and_delete_confirmation}>
                          Are you sure you want to delete ‘Network Topologies’? Type ‘Network Topologies’ to confirm.
                        </p>

                        <div
                          className={
                            styles.confirm_archive_and_delete_container
                          }
                        >
                          <input
                            type="text"
                            name="archive"
                            id="archive"
                            className={`${styles.confirm_textbox} ${styles.confirm}`}
                          />
                          <button
                            className={`${styles.confirm_button} ${styles.confirm}`}
                            onClick={nextStepDelete}
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
                        Deleted ‘Network Topologies’ successfully.
                      </p>

                      <div className={styles.view_button_container}>
                        <button
                          className={`${styles.view_archived_contents_button}`}
                        >
                          view deleted contents
                        </button>
                      </div>

                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
