import React from 'react'
import styles from '/src/components/Landing/Landing.module.css'
import logo from '../../assets/logo.png'
import landing_photo from '../../assets/landing-photo.png'
import search_icon from '../../assets/search-icon.png'
import navigation_icon from '../../assets/navigation-icon.png'
import navigation_icon_right from '../../assets/navigation-icon-right.png'
import computer_science from '../../assets/computer-science.png'
import information_technology from '../../assets/information-technology.png'

function Landing() {
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.logo_div}>
          <img src={logo} className={styles.logo} />
        </div>
        <div className={styles.login_join_now_div}>
          <button className={`${styles.button} ${styles.login_button}`}>
            log in
          </button>
          <button className={`${styles.button} ${styles.join_now_button}`}>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quo eligendi fugit nihil quae voluptatum sit commodi, fugiat omnis? Autem ea non aut unde quos dolor
          </p>
          <div className={styles.content_search_bar_container}>
            <input type="text"
              className={styles.content_search_bar}
              placeholder='Search'            
            />
            <button className={styles.search_button}>
              <img src={search_icon} className={styles.search_icon} alt="This is a search icon" />
            </button>
          </div>
        </div>

        <div className={styles.content_right}>
          <img src={landing_photo} className={styles.landing_photo}  alt="This is the landing photo" />
        </div>
      </div>


      <div className={styles.footer}>
        <div className={styles.footer_title_container}>
          <h3 className={styles.footer_title}>
            Materials
          </h3>
        </div>


        <div className={styles.footer_slide_container}>
        <div>
            <button className={`${styles.navigation_button}`}>
              <img src={navigation_icon} className={`${styles.navigation_icon}`} alt="This is the left navigation" />
            </button>
          </div>
   

          <div className={styles.slide_content_container}>
            <div className={styles.slide_content}>
              <img src={computer_science} className={styles.slide_topic} alt="This is computer science" />
              <img src={information_technology} className={styles.slide_topic} alt="This is information technology" />
            </div>
          </div>

          <div>
            <button className={`${styles.navigation_button}`}>
              <img src={navigation_icon_right} className={`${styles.navigation_icon}`} alt="This is the right navigation" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing