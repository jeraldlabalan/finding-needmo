import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import styles from "./AddContentPage.module.css";
import Header from "../Header/Header";
import add_icon from "../../assets/add-content-icon.png";
import add_file from "../../assets/add-file-icon.png"
import delete_file_icon_white from "../../assets/delete-file-icon-white.png";
import file_icon_white from "../../assets/file-icon-white.png";

function AddContentPage() {
  const [userEmail, setUserEmail] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [contentFiles, setContentFiles] = useState([]);

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

  const [contentDetails, setContentDetails] = useState({
    title: "",
    description: "",
    subject: "",
    program: "",
    course: "",
    keyword: "",
    contentInput: "",
  });

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

  const handleContentFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    setContentFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleContentFileRemove = (index) => {
    setContentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  //Function to change subject options according to selected program
  useEffect(() => {
    if (contentDetails.program) {
      const filtered = courses.filter(
        (course) => course.Program === parseInt(contentDetails.program)
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]); // Clear subjects when no program is selected
    }
  }, [contentDetails.program, courses]); // Run when program or courses change

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

    // Validate the form fields
    if (
      !contentDetails.title ||
      !contentDetails.description ||
      !contentDetails.program ||
      !contentDetails.subject ||
      !contentDetails.keyword
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
        toast.success("Upload success");

        setContentFiles([]);

        setContentDetails({
          title: "",
          description: "",
          subject: "",
          program: "",
          course: "",
          keyword: "",
          contentInput: "",
        });

        setIsAddContentModalOpen(false);
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });
  };


  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" />
      <div className={styles.container_header}>
        <Header />
      </div>

      <div className={styles.content}>
        <div className={styles.content_header}>
          <div className={styles.content_header_content}>
            <img src={add_icon} alt="edit" />
            <h2>add content</h2>
          </div>
        </div>

        <div className={styles.content_content}>

          <div className={styles.content_content_actual_content}>
            <div className={styles.actual_content_left}>

              <input type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={contentDetails.title}
                onChange={handleAddContentChange}
              />

              <textarea
                placeholder="Write description"
                name="description"
                id="description"
                value={contentDetails.description}
                onChange={handleAddContentChange}
              >
              </textarea>

              <select
                name="program"
                id="program"
                value={contentDetails.program}
                onChange={handleAddContentChange}
              >
                <option value={null}>
                  Program
                </option>
                <option value="1">Computer Science</option>
                <option value="2">Information Technology</option>
              </select>


            </div>

            <div className={styles.actual_content_right}>
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
                      <option
                        value={course.CourseID}
                        key={course.CourseID}
                      >
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
              >
              </textarea>



              <div className={styles.file_holder}>
                {contentFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`${styles.file} ${index % 2 === 0
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


                {/* Add File button */}

                <div className={styles.addFile}>
                  <button className={styles.add_file_button_container}>
                    <input
                      name="contentInput"
                      value={contentDetails.contentInput}
                      type="file"
                      multiple
                      onChange={handleContentFileChange}
                    />
                    <img
                      src={add_file}
                      className={styles.file_icon}
                      alt="add file icon"
                    />
                    add files
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        <button className={styles.content_button} onClick={handleAddContent}>
          upload
        </button>
      </div>
    </div>
  );
}

export default AddContentPage;
