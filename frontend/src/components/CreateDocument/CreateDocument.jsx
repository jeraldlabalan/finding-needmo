import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header'
import styles from './CreateDocument.module.css'
import logo from '../../assets/logo.png'
import file_icon_black from '../../assets/file-icon-black.png'
import delete_icon from '../../assets/delete-icon.png'
import add_file from '../../assets/add-file.png'


function CreateDocument() {

  const location = useLocation();
  const [activeButton, setActiveButton] = useState()

  const handleButtonClick = (button) => {
    setActiveButton(button)
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get('section');
    if (section) {
      setActiveButton(section);
    }
  }, [location]);

  return (
    <div className={styles.create_document_container}>
      <div className={styles.create_document_header_container}>
        <Header />
      </div>

      <div className={styles.logo_container}>
        <img className={styles.logo} src={logo} alt="logo" />
      </div>

      <div className={styles.create_document_main_content}>
          <div className={styles.main_content_header}>
            <button 
            className={`${styles.main_content_header_button} 
            ${activeButton === 'document' ? styles.active_button : ''}`}
            onClick={() => handleButtonClick('document')}
          >
              document
            </button>
            <button className={`${styles.main_content_header_button} 
            ${activeButton === 'presentation' ? styles.active_button : ''}`}
            onClick={() => handleButtonClick('presentation')}
          >
              presentation
            </button>
          </div>
          <div className={styles.main_content_content}>
              
              <label htmlFor="file-upload" className={styles.add_file_button} >
                <div>
                  <img src={add_file} alt="add" />
                  <input type="file" id='file-upload' />
                </div>
                <p>
                  create new file
                </p>
              </label>

              {(activeButton === "document" && (
                <>
                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>

                  <div className={styles.file_container}>
                    <img className={styles.file_icon} src={file_icon_black} alt="file icon" />
                    <p>CP Arrayasdasdasdasdasdasdasdasdsas</p>
                    <img className={styles.delete_icon} src={delete_icon} alt="delete icon" />
                  </div>
            
                  
                  
                </>
              ))}

              {(activeButton === "presentation" && (
                <>
                </>
              ))}
          </div>
      </div>
    </div>
  )
}

export default CreateDocument