import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import styles from "./SearchHistory.module.css";
import uploadedPFP from "../../assets/default-profile-photo.jpg";
import profile from "../../assets/profile.jpg";
import search_history from "../../assets/search-history.jpg";
import account_settings from "../../assets/account-settings.jpg";
import manage_content from "../../assets/manage-content.jpg";
import logout from "../../assets/logout.jpg";
import logo from "../../assets/logo.png";
import calendar_icon from "../../assets/calendar-icon.png";
import delete_search from "../../assets/close-icon-modal.png";
import trash_icon from "../../assets/delete-content-icon.png";

function SearchHistory() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const calendarInputRef = useRef(null);
  const [isClearSearchModalOpen, setIsClearSearchModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [isClearSearchStepTwo, setIsClearSearchStepTwo] = useState(false);
  const [isAllStepTwo, setIsAllStepTwo] = useState(false);

  const handleCalendarClick = () => {
    if (calendarInputRef.current) {
      calendarInputRef.current.showPicker(); // Modern approach to trigger date picker
    }
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    // Implement logout functionality here
    logoutFunction(navigate);
  };

  const openClearSearchModal = () => {
    setIsClearSearchModalOpen(true);
    setIsClearSearchStepTwo(false);
  };

  const closeClearSearchModal = () => {
    setIsClearSearchModalOpen(false);
    setIsClearSearchStepTwo(false);
  };

  const openAllModal = () => {
    setIsAllModalOpen(true);
    setIsAllStepTwo(false);
  };

  const closeAllModal = () => {
    setIsAllModalOpen(false);
    setIsAllStepTwo(false);
  };

  const handleClearSearchConfirm = () => {
    // Add clear search functionality here
    setIsClearSearchStepTwo(true);
  };

  const handleAllConfirm = () => {
    // Add functionality to display all search history here
    setIsAllStepTwo(true);
  };

  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const handleIconClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // Trigger the native date picker
    }
  };

  const [startDate, setStartDate] = useState("Start Date");
  const [endDate, setEndDate] = useState("End Date");

  const handleDateChange = (event, setDate) => {
    const selectedDate = event.target.value;
    setDate(new Date(selectedDate).toLocaleDateString()); // Format the date (MM/DD/YYYY)
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
          <div className={styles.calendar_container}>
            <img
              src={calendar_icon}
              className={styles.calendar_icon}
              alt="Calendar Icon"
              onClick={handleCalendarClick}
            />
            <input
              type="date"
              id="calendar-input"
              className={styles.calendar_input}
              ref={calendarInputRef}
            />
          </div>

          <div className={styles.search_history_action_buttons}>
            <button onClick={openClearSearchModal}>clear search</button>
            <button onClick={openAllModal}>all </button>
          </div>
        </div>

        <div className={styles.search_history_content}>
          <div className={styles.search_history_item}>
            <h1>today</h1>
            <hr />
            <ul>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
            </ul>
          </div>

          <div className={styles.search_history_item}>
            <h1>yesterday</h1>
            <hr />
            <ul>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
            </ul>
          </div>

          <div className={styles.search_history_item}>
            <h1>
              <span>january</span>
              <span>12,</span>
              <span>2021</span>
            </h1>
            <hr />
            <ul>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
              <li>
                <p>search query</p>
                <img src={delete_search} alt="delete" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clear Search Modal */}
      {isClearSearchModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            {!isClearSearchStepTwo ? (
              <>
                <img
                  className={styles.delete_search}
                  onClick={closeClearSearchModal}
                  src={delete_search}
                  alt="delete icon"
                />

                <div className={styles.modal_title}>
                  <img
                    className={styles.trash_icon}
                    src={trash_icon}
                    alt="trash icon"
                  />
                  <h2>choose custom date</h2>
                </div>

                <div className={styles.modal_choose_date}>
                  {/* Start Date */}
                  <div className={styles.calendarContainer}>
                    <span className={styles.label}>{startDate}</span>
                    <img
                      src={calendar_icon}
                      alt="Calendar Icon"
                      className={styles.calendarIcon}
                      onClick={() => handleIconClick(startDateInputRef)}
                    />
                    <input
                      type="date"
                      ref={startDateInputRef}
                      className={styles.dateInput}
                      onChange={(e) => handleDateChange(e, setStartDate)}
                    />
                  </div>

                  {/* End Date */}
                  <div className={styles.calendarContainer}>
                    <span className={styles.label}>{endDate}</span>
                    <img
                      src={calendar_icon}
                      alt="Calendar Icon"
                      className={styles.calendarIcon}
                      onClick={() => handleIconClick(endDateInputRef)}
                    />
                    <input
                      type="date"
                      ref={endDateInputRef}
                      className={styles.dateInput}
                      onChange={(e) => handleDateChange(e, setEndDate)}
                    />
                  </div>
                </div>

                <button className={styles.confirm_delete_button} onClick={handleClearSearchConfirm}>
                  delete history
                </button>
              </>
            ) : (
              <>
                 <img
                  className={styles.delete_search}
                  onClick={closeClearSearchModal}
                  src={delete_search}
                  alt="delete icon"
                />
                 <div className={styles.modal_title}>
                  <img
                    className={styles.trash_icon}
                    src={trash_icon}
                    alt="trash icon"
                  />
                  <h2>choose custom date</h2>
                  </div>
                <p>Selected searches deleted successfully.</p>
                <button onClick={closeClearSearchModal}>Done</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* All Modal */}
      {isAllModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            {!isAllStepTwo ? (
              <>
                <img onClick={closeAllModal} src={delete_search} alt="delete icon" />
                <div className={styles.modal_title}>
                  <img
                    className={styles.trash_icon}
                    src={trash_icon}
                    alt="trash icon"
                  />
                  <h2>Delete History</h2>
                </div>
                <p>Are you sure to delete all of your searches?</p>
                <button onClick={handleAllConfirm}>CONFIRM</button>
              </>
            ) : (
              <>
                <div className={styles.modal_title}>
                  <img
                    className={styles.trash_icon}
                    src={trash_icon}
                    alt="trash icon"
                  />
                  <h2>Delete History</h2>
                </div>
                <p>All searches deleted successfully.</p>
                <button onClick={closeAllModal}>DONE</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchHistory;
