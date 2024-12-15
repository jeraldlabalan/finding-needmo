import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '/src/components/Landing/Landing.module.css';
import logo from '../../assets/logo.png';
import landing_photo from '../../assets/landing-photo.png';
import search_icon from '../../assets/search-icon.png';
import navigation_icon from '../../assets/navigation-icon.png';
import navigation_icon_right from '../../assets/navigation-icon-right.png';
import computer_science from '../../assets/computer-science.png';
import information_technology from '../../assets/information-technology.png';

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
    if (e.key === 'Enter') {
      openModal();
    }
  };

  const slideRef = useRef(null);

  const slideLeft = () => {
    if (slideRef.current) {
      slideRef.current.scrollLeft -= slideRef.current.offsetWidth; // Move left by container width
    }
  };

  const slideRight = () => {
    if (slideRef.current) {
      slideRef.current.scrollLeft += slideRef.current.offsetWidth; // Move right by container width
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo_div}>
          <img src={logo} className={styles.logo} />
        </div>
        <div className={styles.login_join_now_div}>
        <Link to="/registerlogin?form=login">
          <button
            className={`${styles.button} ${styles.login_button}`}
          >
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
            Discover new knowledge, uncover insights and share educational contents that matter the most. <strong>Finding Needmo</strong> is an educational content repository and search engine <strong>for students, by students</strong>. 
          </p>
          <div className={styles.content_search_bar_container}>
            <input
              type="text"
              className={styles.content_search_bar}
              placeholder="Start Searching..."
              onKeyDown={handleKeyPress} 
            />
            <button
              className={styles.search_button}
              onClick={openModal} 
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
        <div className={styles.modal_overlay} onClick={closeModal}>
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >

          
            <h2 className={styles.modal_title}>
              join us
            </h2>
            <p className={styles.modal_subtitle}>
              Create an account to unlock features, stay updated and connect with students and educators around the world.
            </p>

            <div className={styles.modal_buttons_container}>

            <Link to="/registerlogin?form=login" className={`${styles.login_button} ${styles.modal_button}`} >
              <button className={`${styles.login_button} ${styles.modal_button}`}>
                log in
              </button>
            </Link>

            <Link to="/registerlogin?form=form" className={`${styles.login_button} ${styles.modal_button}`}>
              <button className={`${styles.signup_button} ${styles.modal_button}`}>
                sign up
              </button>
            </Link>
              <button className={`${styles.close_button} ${styles.modal_button}`} onClick={closeModal}>
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

  <div className={styles.footer}>
      <div className={styles.footer_title_container}>
        <h3 className={styles.footer_title}>Materials</h3>
      </div>

      <div className={styles.footer_slide_container}>
        <div>
          <button
            className={`${styles.navigation_button}`}
            onClick={slideLeft}
          >
            <img
              src={navigation_icon}
              className={`${styles.navigation_icon}`}
              alt="Left Navigation"
            />
          </button>
        </div>

        <div className={styles.slide_content_container} ref={slideRef}>

          <div className={styles.slide_content}>
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

          <div className={styles.slide_content}>
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

        <div>
          <button
            className={`${styles.navigation_button}`}
            onClick={slideRight}
          >
            <img
              src={navigation_icon_right}
              className={`${styles.navigation_icon}`}
              alt="Right Navigation"
            />
          </button>
        </div>
      </div>
    </div>

    </div>
  );
}

export default Landing;
