import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import notification from "../../assets/notification_icon.png";
import default_profile from "../../assets/default-profile-photo.jpg";
import profile from "../../assets/profile.jpg";
import account_settings from "../../assets/account-settings.jpg";
import logout from "../../assets/logout.jpg";
import search_history from "../../assets/search-history.jpg";
import manage_content from "../../assets/manage-content.jpg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoutFunction from '../logoutFunction.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {
  const location = useLocation(); // For detecting active path
  const [activeDropdown, setActiveDropdown] = useState(null); // Manages active dropdown state
  const [userEmail, setUserEmail] = useState("");
  const [uploadedPFP, setUploadedPFP] = useState(null);

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

  useEffect(() => {
    axios.get('http://localhost:8080/getProfile')
    .then((res) => {
      const {message, pfp} = res.data;
      if(message === "User profile fetched successfully"){
        setUploadedPFP(pfp);
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

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    logoutFunction(navigate);
};

  return (
    <div className={styles.header_container}>
      <ToastContainer position='top-center' />
      {/* Notification Menu */}
      <div className={styles.profile_menu_container}>
      <button
        className={`${styles.notification_menu} ${
          activeDropdown === "notification" ? styles.active : ""
        }`}
        onClick={() => toggleDropdown("notification")}
      >
        <img  
          src={notification}
          className={styles.notification_icon}
          alt="Notification Icon"
        />
      </button>

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

      {/* Dropdown Menu */}

      {activeDropdown === "notification" && (
        <div className={`${styles.dropdown_menu} ${styles.notification_dropdown_menu}`}>
          <ul>
            <li>New Notification 1</li>
            <li>New Notification 2</li>
          </ul>
        </div>
      )}

      {activeDropdown === "profile" && (
        <div className={styles.dropdown_menu}>
          <ul>
            <li className={location.pathname === "/profile" ? styles.active_link : ""}>
              <Link to="/profile">
                <img src={profile} className={styles.dropdown_menu_logo} alt="Profile" />
                Profile
              </Link>
            </li>
            <li
              className={
                location.pathname === "/search-history" ? styles.active_link : ""
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
    </div>
  );
}

export default Header;
