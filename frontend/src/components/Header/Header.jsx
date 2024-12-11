import React, { useState } from "react";
import styles from "./Header.module.css";
import default_profile from '../../assets/default-profile-photo.jpg'
import profile from '../../assets/profile.jpg';
import account_settings from '../../assets/account-settings.jpg';
import logout from '../../assets/logout.jpg';
import search_history from '../../assets/search-history.jpg'
import manage_content from '../../assets/manage-content.jpg'


function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.header_container}>
      {/* Profile Menu */}
      <button className={styles.profile_menu} onClick={toggleMenu}>
        <img src={default_profile} className={styles.default_profile} alt="This is the default profile photo" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdown_menu}>

          <ul>

            <li>
              <a href="/profile">
              <img src={profile} className={styles.dropdown_menu_logo} alt="This is profile icon" /> 
              Profile
            </a>
            </li>

            <li>
              <a href="/settings">
              <img src={search_history} className={styles.dropdown_menu_logo} alt="This is search history icon" />
              Search History
              </a>
            </li>

            <li>
              <a href="/logout">
              <img src={account_settings} className={styles.dropdown_menu_logo} alt="This is account settings icon" />
              Account Settings
              </a>
            </li>

            <li>
              <a href="/logout">
              <img src={manage_content} className={styles.dropdown_menu_logo} alt="This is manage content icon" />
              Manage Content
              </a>
            </li>
            <li>
              <a href="/logout"><img src={logout} className={styles.dropdown_menu_logo} alt="This is logout icon" />
              Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
