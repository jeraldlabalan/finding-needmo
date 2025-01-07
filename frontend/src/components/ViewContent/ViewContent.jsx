import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function ViewContent() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Dropdown menu toggle handler
  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  // Alternative file storage
  const files = [
    { id: 1, title: "Document 1", extension: "docx", author: "Lele Pons" },
    { id: 2, title: "Presentation 1", extension: "pptx", author: "Lele Pons" },
    { id: 3, title: "PDF 1", extension: "pdf", author: "Lele Pons" },
    // Add more files as needed
  ];

  // Automated thumbnail mapping
  const thumbnailMapping = {
    docx: docs_thumbnail,
    pptx: pptx_thumbnail,
    pdf: pdf_thumbnail,
  };

  return (
    <div className={styles.container}>
      <div className={styles.search_result_header}>
        <img src={logo} alt="Logo" />

        <div
          className={styles.search_result_headercontent_search_bar_container}
        >
          <input
            type="text"
            className={styles.content_search_bar}
            placeholder="Search"
          />
          <button className={styles.search_button}>
            <img
              src={search_icon}
              className={styles.search_icon}
              alt="This is a search icon"
            />
          </button>
        </div>

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
                <h4>Lele Pons</h4>
                <p>Computer Science</p>
              </div>
            </div>
            <div className={styles.content_keywords_container}>
              <div className={styles.content_keywords}>
                <p>Arrays</p>
              </div>

              <div className={styles.content_keywords}>
                <p>Data Types</p>
              </div>

              <div className={styles.content_keywords}>
                <p>Data Structure and Algorithm</p>
              </div>
            </div>
          </div>

          <div className={styles.content_title_and_description_container}>
            <div className={styles.content_title_container}>
              <h1>arrays</h1>
              <img src={greater_icon} alt=">" />
              <p>computer programming II</p>
            </div>

            <div className={styles.content_description_container}>
              <p>
                An array is a collection of data or items stored in contiguous
                memory locations, or database systems. Arrays can be used to
                organize numbers, pictures, or objects in rows and columns. To
                know more about arrays, you may check the presentation and
                documents below.
              </p>
            </div>
          </div>

          <div className={styles.content_files_container}>
            <div className={styles.items_container}>
              {files.map((file) => (
                <div key={file.id} className={styles.item}>
                  <img
                    src={thumbnailMapping[file.extension]}
                    alt={file.title}
                    className={styles.item_thumbnail}
                  />
                  <div className={styles.item_details}>
                    <h3>{file.title}</h3>
                    <p>{file.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewContent;
