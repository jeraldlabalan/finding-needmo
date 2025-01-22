import React from "react";
import styles from "./AddContentPage.module.css";
import Header from "../Header/Header";
import add_icon from "../../assets/add-content-icon.png";
import add_file from "../../assets/add-file-icon.png"
import delete_file_icon_white from "../../assets/delete-file-icon-white.png";
import file_icon_white from "../../assets/file-icon-white.png";

function AddContentPage() {
  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <Header />
      </div>

      <div className={styles.content}>
        <div className={styles.content_header}>
          <div className={styles.content_header_content}>
            <img src={add_icon} alt="edit" />
            <h2>add content</h2>
          </div>
        </div>

        <div className={styles.content_content}>

          <div className={styles.content_content_actual_content}>
            <div className={styles.actual_content_left}>

              <input type="text"
                placeholder="Title"
             />

             <textarea 
             placeholder="Write description"
              name="description"
              id="description">
             </textarea>

             <select name="subject" id="subject">
              <option value="" disabled>Select Subject</option>
              <option value="COSC 75">COSC 75</option>
              <option value="COSC 101">COSC 101</option>
             </select>

            </div>

            <div className={styles.actual_content_right}>
              <input type="text"
                placeholder="Program"
              />
              <textarea name="keywords" id="keywords">
              </textarea>



              <div className={styles.file_holder}>


                {/* {contentFiles.map((file, index) => ( */}
                                        <div
                                          // key={index}
                                          // className={`${styles.file} ${
                                          //   index % 2 === 0
                                          //     ? styles.file_icon_white
                                          //     : styles.file_icon_black
                                          // }`}
                                          className={styles.file}
                                        >
                                          <img
                                            src={file_icon_white} // Use appropriate file icon
                                            className={styles.file_icon}
                                            alt="file icon"
                                          />
                                          <p className={styles.file_name}>
                                              asdasdasdddddddddddddddddddddddddddddddddddddddddddddddddd
                                            {/* {file.name} */}
                                            
                                          </p>{" "}
                                          {/* Display file name */}
                                          <img
                                            src={delete_file_icon_white} // Use appropriate delete icon
                                            className={styles.file_icon}
                                            alt="remove file icon"
                                            // onClick={() => handleContentFileRemove(index)} // Remove file
                                          />
                                        </div>
                                      {/* ))} */}
                


                {/* Add File button */}
                <label htmlFor="add-file">
                  <img src={add_file} alt="add file" />
                  add file
                  <input type="file" name="add-file" id="add-file" />
                </label>

              </div>
            </div>

          </div>

        </div>

        <button className={styles.content_button}>
          save changes
        </button>
      </div>
    </div>
  );
}

export default AddContentPage;
