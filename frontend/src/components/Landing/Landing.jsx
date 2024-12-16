import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "/src/components/Landing/Landing.module.css";
import logo from "/src/assets/logo.png";
import landing_photo from "/src/assets/landing-photo.png";
import search_icon from "/src/assets/search-icon.png";
import computer_science from "/src/assets/computer-science.png";
import information_technology from "/src/assets/information-technology.png";

function Landing() {
  // Modal logic
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Press event, kapag pinindot yung enter sa keyboard, mati-trigger yung modal
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      openModal();
    }
  };

  const [searchInput, setSearchInput] = useState("");

  // For typing animation of the placeholder of search bar. Naka-loop.
  const fullText = "Start Searching...";
  const [placeholderText, setPlaceholderText] = useState("");
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(true); // For tracking if typing animation is active
  const [isInputFocused, setIsInputFocused] = useState(false); // For tracking focus state of the input field

  useEffect(() => {
    if (!isTypingActive || isInputFocused) return;

    const typingSpeed = 200;
    const erasingSpeed = 200;

    const typingInterval = setInterval(() => {
      if (typingIndex < fullText.length && !isErasing) {
        setPlaceholderText((prev) => prev + fullText[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }
    }, typingSpeed);

    const erasingInterval = setInterval(() => {
      if (typingIndex === fullText.length && !isErasing) {
        setIsErasing(true);
      }
      if (isErasing && typingIndex > 0) {
        setPlaceholderText((prev) => prev.slice(0, -1));
        setTypingIndex((prev) => prev - 1);
      } else if (isErasing && typingIndex === 0) {
        setIsErasing(false);
      }
    }, erasingSpeed);

    return () => {
      clearInterval(typingInterval);
      clearInterval(erasingInterval);
    };
  }, [typingIndex, isErasing, isTypingActive, isInputFocused]);

  // For cursor visibility
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      if (!isInputFocused) {
        setIsCursorVisible((prev) => !prev);
      }
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [isInputFocused]);

  const handleFocus = () => {
    setIsInputFocused(true);
    setIsTypingActive(false);
    setIsCursorVisible(false);
    setPlaceholderText("");
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    setIsTypingActive(true);
    setIsCursorVisible(true);
    setTypingIndex(0);
    setPlaceholderText("");
    setSearchInput("");
    setPlaceholderText("");
  };

  const handleSearchButtonClick = () => {
    openModal();
  };

  const resetTypingAnimation = () => {
    setTypingIndex(0);
    setPlaceholderText("");
    setIsTypingActive(true);
  };

  const handleCancel = () => {
    if (searchInput.trim() !== "") {
      resetTypingAnimation();
      setSearchInput("");
      setPlaceholderText("");
      setIsCursorVisible(false);
    }
    closeModal();
  };

  const handleModalButtonClick = (action) => {
    setSearchInput("");
    resetTypingAnimation();
    if (action === "close") closeModal();
  };

  // Para lang ma-make sure na may animations sa slide content container kapag nag-load na page
  useEffect(() => {
    const container = document.querySelector(
      `.${styles.slide_content_container}`
    );
    if (container) {
      container.classList.add(styles.animate);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo_div}>
          <img src={logo} className={styles.logo} alt="logo" />
        </div>
        <div className={styles.login_join_now_div}>
          <Link to="/registerlogin?form=login">
            <button className={`${styles.button} ${styles.login_button}`}>
              log in
            </button>
          </Link>
          <button
            className={`${styles.button} ${styles.join_now_button}`}
            onClick={openModal} // Open modal on join_now_button click
          >
            join now
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.content_left}>
          <h1 className={styles.content_title}>
            For students<span className={styles.yellow}>, </span>
            by students<span className={styles.blue}>.</span>
          </h1>
          <p className={styles.content_subtitle}>
            Discover new knowledge, uncover insights and share educational
            contents that matter the most. <strong>Finding Needmo</strong> is an
            educational content repository and search engine{" "}
            <strong>for students, by students</strong>.
          </p>
          <div
            data-testid="search-container"
            className={styles.content_search_bar_container}
          >
            <input
              data-testid="search-input"
              type="text"
              className={styles.content_search_bar}
              placeholder={placeholderText + (isCursorVisible ? "|" : "")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              className={styles.search_button}
              onClick={handleSearchButtonClick}
            >
              <img
                src={search_icon}
                className={styles.search_icon}
                alt="This is a search icon"
              />
            </button>
          </div>
        </div>

        <div className={styles.content_right}>
          <img
            src={landing_photo}
            className={styles.landing_photo}
            alt="This is the landing photo"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={styles.modal_overlay}
          onClick={closeModal}
          data-testid="modal"
          role="dialog"
          aria-labelledby="modal-title"
          aria-hidden={!isModalOpen}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 id="modal-title" className={styles.modal_title}>
              join us
            </h2>
            <p className={styles.modal_subtitle}>
              Create an account to unlock features, stay updated and connect
              with students and educators around the world.
            </p>

            <div className={styles.modal_buttons_container}>
              <Link
                to="/registerlogin?form=login"
                className={`${styles.login_button} ${styles.modal_button}`}
              >
                <button
                  data-testid="login-button"
                  className={`${styles.login_button} ${styles.modal_button}`}
                  onClick={() => handleModalButtonClick("login")}
                >
                  log in
                </button>
              </Link>

              <Link
                to="/registerlogin?form=form"
                className={`${styles.login_button} ${styles.modal_button}`}
              >
                <button
                  className={`${styles.signup_button} ${styles.modal_button}`}
                  onClick={() => handleModalButtonClick("signup")}
                >
                  sign up
                </button>
              </Link>
              <button
                className={`${styles.close_button} ${styles.modal_button}`}
                onClick={handleCancel}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer} data-testid="footer">
        <div className={styles.footer_title_container}>
          <h3 className={styles.footer_title}>Materials</h3>
        </div>

        <div className={styles.footer_slide_container}>
          <div
            className={`${styles.slide_content_container} ${styles.animate}`}
            data-testid="slide-content-container"
          >
            <div data-testid="slide-content" className={styles.slide_content}>
              <img
                src={computer_science}
                className={styles.slide_topic}
                alt="This is computer science"
              />
              <img
                src={information_technology}
                className={styles.slide_topic}
                alt="This is information technology"
              />
            </div>

            <div data-testid="slide-content" className={styles.slide_content}>
              <img
                src={computer_science}
                className={styles.slide_topic}
                alt="This is computer science"
              />
              <img
                src={information_technology}
                className={styles.slide_topic}
                alt="This is information technology"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
