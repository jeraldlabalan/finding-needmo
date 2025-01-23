import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./ViewContent.module.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search-icon.png";
import uploadedPFP from "../../assets/default-profile-photo.jpg";
import profile from "../../assets/profile.jpg";
import search_history from "../../assets/search-history.jpg";
import account_settings from "../../assets/account-settings.jpg";
import manage_content from "../../assets/manage-content.jpg";
import logout from "../../assets/logout.jpg";
import go_back from "../../assets/go_back.png";
import greater_icon from "../../assets/greater_icon.png";
import docs_thumbnail from "../../assets/file-icon-blue.png";
import pdf_thumbnail from "../../assets/file-icon-black.png";
import pptx_thumbnail from "../../assets/file-icon-yellow.png";
import SecondHeader from "../SecondHeader/SecondHeader";

function ViewContent() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState('');
  const { contentID } = useParams();
  const [searchRes, setSearchRes] = useState({});
  const [docx, setDocx] = useState([]);
  const [ppts, setPPTs] = useState([]);
  const [pdfs, setPDFs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/viewContentDetails/${contentID}`);
        setSearchRes(res.data.results);
        setDocx(res.data.docxFiles);
        setPPTs(res.data.pptFiles);
        setPDFs(res.data.pdfFiles);
        setVideos(res.data.videoFiles);
        setAudios(res.data.audioFiles);
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error("Error getting search results", {
          autoClose: 2000,
        });
      }
    };
    fetchData();
  }, []);

  // Dropdown menu toggle handler
  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  const getColor = (value) => {
    if (value === "Computer Science" || value === 1) {
      return "#C00202";
    } else if (value === "Information Technology" || value === 2) {
      return "#057008";
    }
    return "#000";
  };

  return (
    <div className={styles.container}>
      <div className={styles.view_content_header}>
        <SecondHeader />
      </div>

      <div className={styles.content_container}>
        <div className={styles.go_back_button_container}>
          <button className={styles.go_back_button}>
            <img src={go_back} alt="go back" />
            Go Back
          </button>
        </div>

        <div className={styles.content}>
          {/* Content goes here */}
          <div className={styles.content_author_and_keywords_container}>
            <div className={styles.content_author_container}>
              <img src={uploadedPFP} alt="Author" />
              <div className={styles.author_details}>
                <h4>{searchRes.Firstname} {searchRes.Lastname}</h4>
                <p style={{ color: getColor(searchRes.Program) }}>{searchRes.Program === 1 ? "Computer Science" : "Information Technology"}</p>
              </div>
            </div>
            <div className={styles.content_keywords_container}>
              {searchRes.Tags &&
                searchRes.Tags.split(",").map((tag, index) => (
                  <div key={index} className={styles.content_keywords}>
                    <p>{tag.trim()}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.content_title_and_description_container}>
            <div className={styles.content_title_container}>
              <h1>{searchRes.Title}</h1>
              <img src={greater_icon} alt=">" />
              <p>{searchRes.CourseTitle}</p>
            </div>

            <div className={styles.content_description_container}>
              <p>{searchRes.Description}</p>
            </div>
          </div>

          <div className={styles.content_files_container}>
            <div className={styles.items_container}>
            {audios.length > 0 ? (
  audios.map((item, index) => {
    const audioFiles = item.audioFiles;

    if (audioFiles.length === 0) {
      return null;
    }

    return audioFiles.map((file, fileIndex) => {
      const fileUrl = `http://localhost:8080/${file.path.replace(/\\/g, "/")}`; // Replace backslashes with forward slashes
      return (
        <div key={`${index}-${fileIndex}`} className={styles.audio_item}>
          <audio
            src={fileUrl}
            controls
            className={styles.item_audio}
            style={{ width: "100%" }}
          >
            Your browser does not support the audio tag.
          </audio>
          <div className={styles.item_details}>
            <h3 style={{ textAlign: "center" }}>{file.originalName}</h3>
            <p>
              {searchRes.Firstname} {searchRes.Lastname}
            </p>
          </div>
        </div>
      );
    });
  })
) : (
  ""
)}


            {videos.length > 0 ? (
  videos.map((item, index) => {
    const videoFiles = item.videoFiles;

    if (videoFiles.length === 0) {
      return null;
    }

    return videoFiles.map((file, fileIndex) => {
      const fileUrl = `http://localhost:8080/${file.path.replace(/\\/g, "/")}`; // Replace backslashes with forward slashes
      return (
        <div key={`${index}-${fileIndex}`} className={styles.video_item}>
          <video
            src={fileUrl}
            controls
            className={styles.item_video}
            style={{ width: "100%", height: "auto" }}
          >
            Your browser does not support the video tag.
          </video>
          <div className={styles.item_details}>
            <h3 style={{ textAlign: "center" }}>{file.originalName}</h3>
            <p>
              {searchRes.Firstname} {searchRes.Lastname}
            </p>
          </div>
        </div>
      );
    });
  })
) : (
  ""
)}


            {docx.length > 0 ? (
                docx.map((item, index) => {
                  const docxFiles = item.docxFiles;

                  if (docxFiles.length === 0) {
                    return null;
                  }

                  return docxFiles.map((file, fileIndex) => {
                    const fileUrl = `http://localhost:8080/${file.path.replace(
                      /\\/g,
                      "/"
                    )}`; // Replace backslashes with forward slashes
                    return (
                        <a
                          key={`${index}-${fileIndex}`}
                          href={fileUrl} // Use the dynamically generated file URL
                          download={file.originalName} // Set the file name for download
                          target="_blank"
                          className={styles.item}
                        >
                            <img
                              src={docs_thumbnail}
                              alt={file.originalName}
                              className={styles.item_thumbnail}
                            />
                            <div className={styles.item_details}>
                              <h3 style={{textAlign: 'center'}}>{file.originalName}</h3>
                              <p>{searchRes.Firstname} {searchRes.Lastname}</p>
                            </div>
                        </a>
                    );
                  });
                })
              ) : ("")}

{ppts.length > 0 ? (
                ppts.map((item, index) => {
                  const pptFiles = item.pptFiles;

                  if (pptFiles.length === 0) {
                    return null;
                  }

                  return pptFiles.map((file, fileIndex) => {
                    const fileUrl = `http://localhost:8080/${file.path.replace(
                      /\\/g,
                      "/"
                    )}`; // Replace backslashes with forward slashes
                    return (
                        <a
                          key={`${index}-${fileIndex}`}
                          href={fileUrl} // Use the dynamically generated file URL
                          download={file.originalName} // Set the file name for download
                          target="_blank"
                          className={styles.item}
                        >
                            <img
                              src={pptx_thumbnail}
                              alt={file.originalName}
                              className={styles.item_thumbnail}
                            />
                            <div className={styles.item_details}>
                              <h3 style={{textAlign: 'center'}}>{file.originalName}</h3>
                              <p>{searchRes.Firstname} {searchRes.Lastname}</p>
                            </div>
                        </a>
                    );
                  });
                })
              ) : ("")}


              {pdfs.length > 0 ? (
                pdfs.map((item, index) => {
                  const pdfFiles = item.pdfFiles;

                  if (pdfFiles.length === 0) {
                    return null;
                  }

                  return pdfFiles.map((file, fileIndex) => {
                    const fileUrl = `http://localhost:8080/${file.path.replace(
                      /\\/g,
                      "/"
                    )}`; // Replace backslashes with forward slashes
                    return (
                        <a
                          key={`${index}-${fileIndex}`}
                          href={fileUrl} // Use the dynamically generated file URL
                          download={file.originalName} // Set the file name for download
                          target="_blank"
                          className={styles.item}
                        >
                            <img
                              src={pdf_thumbnail}
                              alt={file.originalName}
                              className={styles.item_thumbnail}
                            />
                            <div className={styles.item_details}>
                              <h3 style={{textAlign: 'center'}}>{file.originalName}</h3>
                              <p>{searchRes.Firstname} {searchRes.Lastname}</p>
                            </div>
                        </a>
                    );
                  });
                })
              ) : ("")}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewContent;
