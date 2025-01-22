import React, { useState, useEffect } from "react";
import styles from "./ProfileStudent.module.css"
import Header from "../Header/Header";
import default_photo from "../../assets/default-profile-photo.jpg";
import role_icon_black from "../../assets/role-icon-black.png"
import information_icon from "../../assets/information-icon.png";
import modal_close_icon from "../../assets/close-icon-modal.png";
import edit_profile_icon from "../../assets/edit-profile-icon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ProfileStudent() {
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

  const [csContributions, setCSContributions] = useState(0);
  const [itContributions, setITContributions] = useState(0);

  const [userEmail, setUserEmail] = useState("");
  const [userColumns, setUserColumns] = useState([]);
  const [profileColumns, setProfileColumns] = useState([]);
  const [uploadedPFP, setUploadedPFP] = useState(null);
  const [initialPFP, setInitialPFP] = useState(null);

  const [profileInfo, setProfileInfo] = useState({
    uploadPFP: null,
    pfpURL: "",
    firstName: "",
    lastName: "",
    program: "",
  });

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

  const [uploadedContent, setUploadedContent] = useState([]);

  useEffect(() => {
    // Fetch the uploaded content data
    axios
      .get("http://localhost:8080/getUploadedContent")
      .then((response) => {
        if (response.data.uploadedContent) {
          setUploadedContent(response.data.uploadedContent);
        }
      })
      .catch((error) => console.error("Error fetching content:", error));
  }, [uploadedContent]);

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

   // Function to open the modals
   const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  // Function to close the modals
  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
    setUploadedPFP(initialPFP);
  };

  // Function to handle the file upload change
  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Create a URL for the selected image
      setProfileInfo((prevState) => ({
        ...prevState,
        uploadPFP: file, // Store the file itself
        pfpURL: url, // Store the image URL for previewing
      }));

      setUploadedPFP(url);
    }
  };

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
  
  useEffect(() => {
    if (selectedRequest) {
      setEditContent({
        contentID: selectedRequest.ContentID,
        title: selectedRequest.Title,
        description: selectedRequest.Description,
        subject: selectedRequest.Course, // Ensure this is correctly set
        program: selectedRequest.Program,
        courseID: selectedRequest.Course,
        courseTitle: selectedRequest.CourseTitle, // Add courseTitle
        keyword: selectedRequest.Tags,
        files: Array.isArray(selectedRequest.Files)
          ? selectedRequest.Files
          : [], // Ensure files is an array
      });

      setEditContentFiles(
        Array.isArray(selectedRequest.Files) ? selectedRequest.Files : []
      ); // Ensure files is an array
    }
  }, [selectedRequest]);

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


  const getProfile = () => {
    axios
      .get("http://localhost:8080/getProfile")
      .then((res) => {
        const { message, pfp, userData, profileData } = res.data;
        if (message === "User profile fetched successfully") {
          setUserColumns(userData);
          setProfileColumns(profileData);
          setUploadedPFP(`http://localhost:8080/${pfp}`);
          setInitialPFP(`http://localhost:8080/${pfp}`);

          setProfileInfo({
            uploadPFP: pfp || null,
            pfpURL: pfp || "",
            firstName: profileData.Firstname || "",
            lastName: profileData.Lastname || "",
            program: profileData.Program || "",
          });
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
  };

  useEffect(() => {
    getProfile();
  }, []);

  const saveProfileChanges = () => {
    const data = new FormData();

    if (profileInfo.uploadPFP) {
      data.append("uploadPFP", profileInfo.uploadPFP);
    }
    data.append("pfpURL", profileInfo.pfpURL);
    data.append("firstName", profileInfo.firstName);
    data.append("lastName", profileInfo.lastName);
    data.append("program", profileInfo.program);

    axios
      .post("http://localhost:8080/saveStdProfileChanges", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.message === "Changes saved") {
          setUploadedPFP(`http://localhost:8080/${res.data.pfpURL}`);          
          getProfile();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      })
      .catch((err) => {
        toast.error("Error: " + err, {
          autoClose: 5000,
        });
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileInfo((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update state
    }));
  };  

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" />
      <div className={styles.header_container}>
        <Header />
      </div>

      <div className={styles.content}>
        <div className={styles.upper_content}>
          <div className={styles.profile_photo_container}>
            <img
              src={uploadedPFP}
              className={styles.display_photo}
              alt="profile photo"
            />
          </div>
          <div className={styles.name_and_role_container}>
            <h1 className={styles.name}>
              {profileColumns.Firstname} {profileColumns.Lastname}
            </h1>
            <div className={styles.role_container}>
              <img
                src={role_icon_black}
                className={styles.role_icon}
                alt="role icon"
              />
              <span className={styles.role}>{userColumns.Role}</span>
            </div>
          </div>
        </div>

        <div className={styles.lower_content}>
          <div className={styles.contributions_and_about_container}>
            <div className={styles.about_container}>
              <h3>about</h3>
              <div className={styles.about_info_container}>
                <div className={styles.info_group}>
                  <img
                    src={information_icon}
                    className={styles.information_icon}
                    alt="information icon"
                  />
                  <p className={styles.info}>Student at
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
                    <span className={styles.bolded_text}>
                      {profileColumns.Program === 1
                        ? "Computer Science"
                        : profileColumns.Program === 2
                          ? "Information Technology"
                          : "_______"}
                    </span>
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

            {/* EDIT PROFILE Modal */}
            {isEditProfileModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeEditProfileModal}
              >
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
                        src={uploadedPFP}
                        className={styles.modal_profile_photo}
                        alt="profile photo"
                      />
                      <div className={styles.add_new_profile_button}>
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
                  </div>

                  <div className={styles.modal_info_container}>
                    <div className={styles.modal_info_group}>
                      <input
                        type="text"
                        name="firstName"
                        id="firstname"
                        value={profileInfo.firstName} // Full name na dapat to
                        placeholder="First name"
                        className={styles.name}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={profileInfo.lastName} // Full name na dapat to
                        placeholder="Last name"
                        className={styles.name}
                        onChange={handleInputChange}
                        required
                      />

                      <select
                        name="program"
                        className={styles.modal_info_input}
                        id="program"
                        onChange={handleInputChange}
                        value={profileInfo.program || null}
                        required
                      >
                        <option value={null} disabled>
                          Select Program
                        </option>
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


          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileStudent;
