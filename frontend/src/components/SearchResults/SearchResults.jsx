import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./SearchResults.module.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search-icon.png";
import uploadedPFP from "../../assets/default-profile-photo.jpg";
import profile from "../../assets/profile.jpg";
import search_history from "../../assets/search-history.jpg";
import account_settings from "../../assets/account-settings.jpg";
import manage_content from "../../assets/manage-content.jpg";
import logout from "../../assets/logout.jpg";
import nav_arrow from "../../assets/nav_arrow.png";
import current_page from "../../assets/current_page.png";
import next_page from "../../assets/next_page.png";
import thumbnail1 from "../../assets/thumbnail_1.jpg";
import thumbnail2 from "../../assets/thumbnail_2.jpg";
import thumbnail3 from "../../assets/thumbnail_3.jpg";

function SearchResults() {
  const files = [
    {
      id: 1,
      title: "CP1_ARRAYS",
      lesson: "ARRAYS",
      extension: "docx",
      author: "Jusko Po",
      thumbnail: thumbnail1,
    },
    {
      id: 2,
      title: "CP2_ARRAYS",
      lesson: "ARRAYS",
      extension: "docx",
      author: "Wag Mag Paistress",
      thumbnail: thumbnail2,
    },
    {
      id: 3,
      title: "CP3_ARRAYS",
      lesson: "ARRAYS",
      extension: "pptx",
      author: "Aw Aw",
      thumbnail: thumbnail3,
    },
    {
      id: 4,
      title: "CP2_ARRAYS",
      lesson: "ARRAYS",
      extension: "pdf",
      author: "PDF Author",
      thumbnail: thumbnail2,
    },
    {
      id: 5,
      title: "CP1_ARRAYS",
      lesson: "ARRAYS",
      extension: "pptx",
      author: "Jusko Po",
      thumbnail: thumbnail1,
    },
    {
      id: 6,
      title: "CP1_ARRAYS",
      lesson: "ARRAYS",
      extension: "pdf",
      author: "Jusko Po",
      thumbnail: thumbnail1,
    },
    {
      id: 7,
      title: "CP3_ARRAYS",
      lesson: "ARRAYS",
      extension: "docx",
      author: "Aw Aw",
      thumbnail: thumbnail3,
    },
    {
      id: 8,
      title: "CP2_ARRAYS",
      lesson: "ARRAYS",
      extension: "pptx",
      author: "Wag Mag Paistress",
      thumbnail: thumbnail2,
    },
    {
      id: 9,
      title: "CP2_ARRAYS",
      lesson: "ARRAYS",
      extension: "pdf",
      author: "PDF Author",
      thumbnail: thumbnail3,
    },
  ];

  // Search result header logic
  const [activeButton, setActiveButton] = useState("contents");

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Dropdown menu toggle handler
  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  // Dropdown select handler logic
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
  };

  const getColor = (value) => {
    if (value === "computer-science") {
      return "#C00202";
    } else if (value === "information-technology") {
      return "#057008";
    }
    return "#000";
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className={styles.container}>
      <div className={styles.search_result_header}>
        <img src={logo} alt="Logo" />

        <div className={styles.search_result_headercontent_search_bar_container}>
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

      <div className={styles.search_result_content}>
        {/* Side Bar */}
        <div className={styles.search_result_sidebar}>
          <div className={styles.search_result_sidebar_filter}>
            <h3>sort by</h3>
            <div className={styles.search_result_sidebar_filter_options_container}>
              <div className={styles.search_result_sidebar_filter_option}>
                <input type="checkbox" />
                <label htmlFor="">Oldest to Newest</label>
              </div>

              <div className={styles.search_result_sidebar_filter_option}>
                <input type="checkbox" />
                <label htmlFor="">Relevance</label>
              </div>

              <div
                className={`${styles.search_result_sidebar_filter_option} ${styles.search_result_sidebar_filter_option_dropdown}`}
              >
                <input type="checkbox" />
                <label>
                  Program
                  <select
                    value={selectedValue}
                    onChange={handleSelect}
                    style={{ color: getColor(selectedValue) }}
                  >
                    <option value="">All</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="information-technology">
                      Information Technology
                    </option>
                  </select>
                </label>
              </div>

              <div
                className={`${styles.search_result_sidebar_filter_option} ${styles.search_result_sidebar_filter_option_dropdown}`}
              >
                <input type="checkbox" />
                <label>
                  Subject
                  <select name="subject">
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

        {/* Main Content */}
        <div className={styles.search_result_main_content}>
          <div className={styles.search_result_main_content_header}>
            <button
              className={`${styles.search_result_main_content_header_button} ${activeButton === 'contents' ? styles.active_button : ''}`}
              onClick={() => handleButtonClick('contents')}
            >
              Contents
            </button>
            <button
              className={`${styles.search_result_main_content_header_button} ${activeButton === 'documents' ? styles.active_button : ''}`}
              onClick={() => handleButtonClick('documents')}
            >
              Documents
            </button>
            <button
              className={`${styles.search_result_main_content_header_button} ${activeButton === 'presentations' ? styles.active_button : ''}`}
              onClick={() => handleButtonClick('presentations')}
            >
              Presentations
            </button>
            <button
              className={`${styles.search_result_main_content_header_button} ${activeButton === 'pdfs' ? styles.active_button : ''}`}
              onClick={() => handleButtonClick('pdfs')}
            >
              PDFs
            </button>
          </div>
          <div className={styles.search_result_main_content_body}>
            {activeButton === 'contents' && (
              <>
                <div className={styles.main_content_body_item}>
                  <div className={styles.upper_section}>
                    <h3>arrays</h3>
                    <p>lele pons</p>
                  </div>
                  <div className={styles.lower_section}>
                    <p>computer programming i</p>
                    <p className={styles.lower_section_program_cs}>
                      computer science
                    </p>
                  </div>
                </div>
                <div className={styles.main_content_body_item}>
                  <div className={styles.upper_section}>
                    <h3>arrays</h3>
                    <p>lele pons</p>
                  </div>
                  <div className={styles.lower_section}>
                    <p>computer programming ii</p>
                    <p className={styles.lower_section_program_cs}>
                      computer science
                    </p>
                  </div>
                </div>
                <div className={styles.main_content_body_item}>
                  <div className={styles.upper_section}>
                    <h3>arrays</h3>
                    <p>lele pons</p>
                  </div>
                  <div className={styles.lower_section}>
                    <p>computer programming ii</p>
                    <p className={styles.lower_section_program_cs}>
                      computer science
                    </p>
                  </div>
                </div>
                <div className={styles.main_content_body_item}>
                  <div className={styles.upper_section}>
                    <h3>arrays</h3>
                    <p>lele pons</p>
                  </div>
                  <div className={styles.lower_section}>
                    <p>computer programming ii</p>
                    <p className={styles.lower_section_program_cs}>
                      computer science
                    </p>
                  </div>
                </div>
                <div className={styles.main_content_body_item}>
                  <div className={styles.upper_section}>
                    <h3>arrays</h3>
                    <p>lele pons</p>
                  </div>
                  <div className={styles.lower_section}>
                    <p>computer programming ii</p>
                    <p className={styles.lower_section_program_cs}>
                      computer science
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeButton === 'documents' && (
              <>
                <div className={styles.document_container}>
                  {files
                    .filter((file) => file.extension === "docx")
                    .map((file) => (
                      <div key={file.id} className={styles.document}>
                        <div className={styles.thumbnail_container}>
                          <img
                            src={file.thumbnail}
                            alt={file.title}
                            className={styles.document_thumbnail}
                          />
                          <div className={styles.lesson_text}>{file.lesson}</div>
                        </div>
                        <div className={styles.document_details}>
                          <h3>{file.title}</h3>
                          <p>{file.author}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {activeButton === 'presentations' && (
              <>
                <div className={styles.presentation_container}>
                  {files
                    .filter((file) => file.extension === "pptx")
                    .map((file) => (
                      <div key={file.id} className={styles.presentation}>
                        <div className={styles.thumbnail_container}>
                          <img
                            src={file.thumbnail}
                            alt={file.title}
                            className={styles.document_thumbnail}
                          />
                          <div className={styles.lesson_text}>{file.lesson}</div>
                        </div>
                        <div className={styles.presentation_details}>
                          <h3>{file.title}</h3>
                          <p>{file.author}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {activeButton === 'pdfs' && (
              <>
                <div className={styles.pdf_container}>
                  {files
                    .filter((file) => file.extension === "pdf")
                    .map((file) => (
                      <div key={file.id} className={styles.pdf}>
                        <div className={styles.thumbnail_container}>
                          <img
                            src={file.thumbnail}
                            alt={file.title}
                            className={styles.document_thumbnail}
                          />
                          <div className={styles.lesson_text}>{file.lesson}</div>
                        </div>
                        <div className={styles.pdf_details}>
                          <h3>{file.title}</h3>
                          <p>{file.author}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* Pagination */}
            <div className={styles.search_result_footer}>
              <div className={styles.search_result_footer_nav}>
                <img
                  src={nav_arrow}
                  className={styles.search_result_footer_nav_button}
                  alt="previous arrow"
                  onClick={handlePreviousPage}
                />

                <div className={styles.search_result_footer_nav_page}>
                  {[...Array(totalPages)].map((_, index) => (
                    <img
                      key={index}
                      src={index + 1 === currentPage ? current_page : next_page}
                      className={`${styles.page} ${
                        index + 1 === currentPage ? styles.current_page : ""
                      }`}
                      alt={`page ${index + 1}`}
                    />
                  ))}
                </div>

                <img
                  src={nav_arrow}
                  className={`${styles.search_result_footer_nav_button} ${styles.rotated}`}
                  alt="next arrow"
                  onClick={handleNextPage}
                />
              </div>

              <div className={styles.search_result_footer_page}>
                <span className={styles.search_result_footer_page_number}>
                  {currentPage}
                </span>
                of
                <span className={styles.search_result_footer_total_page_number}>
                  {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;