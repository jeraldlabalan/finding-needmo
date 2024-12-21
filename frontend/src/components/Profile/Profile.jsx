import React, { useState } from "react";
import styles from "./Profile.module.css";
import Header from "../Header/Header";
import default_photo from "../../assets/default-profile-photo.jpg";
import role_icon from "../../assets/role-icon.png";
import information_icon from "../../assets/information-icon.png";
import edit_icon from "../../assets/edit-icon.png";
import clock_back_icon from "../../assets/clock-back-icon.png";
import delete_icon from "../../assets/delete-icon.png";
import modal_close_icon from "../../assets/close-icon-modal.png";
import edit_profile_icon from "../../assets/edit-profile-icon.png";
import add_content_icon from "../../assets/add-content-icon.png";
import edit_content_icon from "../../assets/edit-content-icon.png";
import archive_content_icon from "../../assets/archive-content-icon.png";
import delte_content_icon from "../../assets/delete-content-icon.png";
import file_icon_white from "../../assets/file-icon-white.png";
import file_icon_black from "../../assets/file-icon-black.png";
import add_file_icon from "../../assets/add-file-icon.png";
import delete_file_icon_black from "../../assets/delete-file-icon-black.png";
import delete_file_icon_white from "../../assets/delete-file-icon-white.png";

function Profile() {
  // Modal logic
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isArchiveContentModalOpen, setIsArchiveContentModalOpen] = useState(false);
  const [isDeleteContentModalOpen, setIsDeleteContentModalOpen] = useState(false);
  const [currentStepDelete, setCurrentStepDelete] = useState(1);
  const [currentStepArchive, setCurrentStepArchive] = useState(1);

  const nextStepArchive = () => {
    setCurrentStepArchive((prev) => (prev < 2 ? prev + 1 : prev));
  };

  const nextStepDelete = () => {
    setCurrentStepDelete((prev) => (prev < 2 ? prev + 1 : prev));
  };

  // Function to open the modals
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  const openEditContentModal = () => {
    setIsEditContentModalOpen(true);
  };

  const openArchiveContentModal = () => {
    setIsArchiveContentModalOpen(true);
  };

  const openAddContentModal = () => {
    setIsAddContentModalOpen(true);
  };

  const openDeleteContentModal = () => {
    setIsDeleteContentModalOpen(true)
  }

  // Function to close the modals
  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const closeEditContentModal = () => {
    setIsEditContentModalOpen(false);
  };

  const closeArchiveContentModal = () => {
    setIsArchiveContentModalOpen(false);
  };

  const closeAddContentModal = () => {
    setIsAddContentModalOpen(false);
  };

  const closeDeleteContentModal = () => {
    setIsDeleteContentModalOpen(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header_container}>
        <Header />
      </div>

      <div className={styles.content}>
        <div className={styles.upper_content}>
          <div className={styles.profile_photo_container}>
            <img src={default_photo} alt="profile photo" />
          </div>
          <div className={styles.name_and_role_container}>
            <h1 className={styles.name}>elaine quisquino</h1>
            <div className={styles.role_container}>
              <img
                src={role_icon}
                className={styles.role_icon}
                alt="role icon"
              />
              <span className={styles.role}>Educator</span>
            </div>
          </div>
        </div>

        <div className={styles.lower_content}>
          <div className={styles.contributions_and_about_container}>
            <div className={styles.contributions_container}>
              <h3>contributions</h3>
              <div className={styles.contributions_counts}>
                <div className={styles.counts_group}>
                  <p className={styles.count_title}>information technology</p>
                  <h3 className={styles.count}>12</h3>
                </div>
                <div className={styles.counts_group}>
                  <p className={styles.count_title}>computer science</p>
                  <h3 className={styles.count}>20</h3>
                </div>
              </div>
            </div>
            <div className={styles.about_container}>
              <h3>about</h3>
              <div className={styles.about_info_container}>
                <div className={styles.info_group}>
                  <img
                    src={information_icon}
                    className={styles.information_icon}
                    alt="information icon"
                  />
                  <p className={styles.info}>
                    Instructor II at
                    <span className={styles.bolded_text}>
                      Cavite State University
                    </span>
                  </p>
                </div>

                <div className={styles.info_group}>
                  <img
                    src={information_icon}
                    className={styles.information_icon}
                    alt="information icon"
                  />
                  <p className={styles.info}>
                    Bachelor of Science in
                    <span className={styles.bolded_text}>Computer Science</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.edit_profile_button_container}>
              <button
                onClick={openEditProfileModal}
                className={styles.edit_profile_button}
              >
                edit profile
              </button>
            </div>
          </div>

          <div className={styles.content_container}>
            <div className={styles.content_heading}>
              <h3>content</h3>
              <button
                className={styles.add_content_button}
                onClick={openAddContentModal}
              >
                add content
              </button>
            </div>

            <div className={styles.content_cards_container}>
              <div className={styles.content_cards}>
                <div className={styles.card}>
                  <div className={styles.card_info}>
                    <h4 className={styles.card_title}>
                      Advanced Object Oriented Programming
                    </h4>
                    <p className={styles.card_subtitle}>
                      Software Engineering II
                    </p>
                  </div>

                  <div className={styles.card_action_container}>
                    <div className={styles.card_actions}>
                      <button className={styles.action}>
                        <img
                          src={edit_icon}
                          className={styles.action_icon}
                          onClick={openEditContentModal}
                          alt="edit icon"
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={clock_back_icon}
                          className={styles.action_icon}
                          alt="clock back icon"
                          onClick={openArchiveContentModal}
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={delete_icon}
                          className={styles.action_icon}
                          alt="delete icon"
                          onClick={openDeleteContentModal}
                        />
                      </button>
                    </div>
                    <span className={styles.program_cs}>computer science</span>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.card_info}>
                    <h4 className={styles.card_title}>Array</h4>
                    <p className={styles.card_subtitle}>
                      Computer Programming I
                    </p>
                  </div>

                  <div className={styles.card_action_container}>
                    <div className={styles.card_actions}>
                      <button className={styles.action}>
                        <img
                          src={edit_icon}
                          className={styles.action_icon}
                          onClick={openEditContentModal}
                          alt="edit icon"
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={clock_back_icon}
                          className={styles.action_icon}
                          onClick={openArchiveContentModal}
                          alt="clock back icon"
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={delete_icon}
                          className={styles.action_icon}
                          alt="delete icon"
                          onClick={openDeleteContentModal}
                        />
                      </button>
                    </div>
                    <span className={styles.program_cs}>computer science</span>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.card_info}>
                    <h4 className={styles.card_title}>Network Topologies</h4>
                    <p className={styles.card_subtitle}>
                      Networks and Communications
                    </p>
                  </div>

                  <div className={styles.card_action_container}>
                    <div className={styles.card_actions}>
                      <button className={styles.action}>
                        <img
                          src={edit_icon}
                          className={styles.action_icon}
                          onClick={openEditContentModal}
                          alt="edit icon"
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={clock_back_icon}
                          className={styles.action_icon}
                          onClick={openArchiveContentModal}
                          alt="clock back icon"
                        />
                      </button>

                      <button className={styles.action}>
                        <img
                          src={delete_icon}
                          className={styles.action_icon}
                          alt="delete icon"
                          onClick={openDeleteContentModal}
                        />
                      </button>
                    </div>
                    <span className={styles.program_it}>
                      information technology
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* EDIT PROFILE Modal */}
            {isEditProfileModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeEditProfileModal}
              >
                <div
                  className={styles.modal_content}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

                  <div className={styles.modal_header}>
                    <h2 className={styles.header_title}>edit profile</h2>
                    <button
                      className={styles.header_close_button}
                      onClick={closeEditProfileModal}
                    >
                      <img
                        src={modal_close_icon}
                        className={styles.header_close_icon}
                        alt="close icon"
                      />
                    </button>
                  </div>

                  <div className={styles.modal_profile_container}>
                    <div className={styles.profile_container}>
                      <img
                        src={default_photo}
                        className={styles.modal_profile_photo}
                        alt="profile photo"
                      />
                      <button className={styles.edit_profile_photo_button}>
                        <img
                          src={edit_profile_icon}
                          className={styles.edit_profile_icon}
                          alt="edit profile photo icon"
                        />
                      </button>
                    </div>
                  </div>

                  <div className={styles.modal_info_container}>
                    <div className={styles.modal_info_group}>
                      <div className={styles.name_container}>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          className={` ${styles.name}`}
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          className={` ${styles.name}`}
                        />
                      </div>

                      <select
                        name="position"
                        className={styles.modal_info_input}
                        id="position"
                      >
                        <option value="Instructor I">Instructor I</option>
                        <option value="Instructor II">Instructor II</option>
                        <option value="Instructor III">Instructor III</option>
                      </select>

                      <select
                        name="program"
                        className={styles.modal_info_input}
                        id="program"
                      >
                        <option value="Bachelor of Science in Computer Science">
                          Bachelor of Science in Computer Science
                        </option>
                        <option value="Bachelor of Science in Information Technology">
                          Bachelor of Science in Information Technology
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.save_changes_button_container}>
                    <button className={styles.save_changes_button}>
                      save changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADD Content Modal */}
            {isAddContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeAddContentModal}
              >
                <div
                  className={`${styles.modal_content} ${styles.modal_content_container}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

                  <div className={styles.modal_content_header}>
                    <button
                      className={styles.header_close_button}
                      onClick={closeAddContentModal}
                    >
                      <img
                        src={modal_close_icon}
                        className={styles.header_close_icon}
                        alt="close icon"
                      />
                    </button>
                  </div>
                  <div className={styles.modal_content_info_container}>
                    <div className={styles.subheader_container}>
                      <img
                        src={add_content_icon}
                        className={styles.subheader_icon}
                        alt="add content icon"
                      />
                      <h2 className={styles.subheader_description}>
                        add content
                      </h2>
                    </div>

                    <input
                      type="text"
                      className={`${styles.modal_content_input} ${styles.modal_content_text}`}
                      name="title"
                      id="title"
                      placeholder="Title"
                    />

                    <textarea
                      name="description"
                      id="description"
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                      placeholder="Write description here..."
                    ></textarea>

                    <select
                      name="subject"
                      id="subject"
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value="">Subject</option>
                      <option value="Software Engineering II">
                        Software Engineering II
                      </option>
                      <option value="Computer Programming I">
                        Computer Programming I
                      </option>
                    </select>

                    <select
                      name="program"
                      id="program"
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value="">Program</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                    </select>

                    <textarea
                      name="keyword"
                      id="keyword"
                      placeholder="Write keywords here..."
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                    ></textarea>

                    <div className={styles.modal_file_container}>
                      {" "}
                      {/* Dito yung mga uploaded files */}
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>
                      <div className={`${styles.file} ${styles.add_file}`}>
                        <img
                          src={add_file_icon}
                          className={styles.file_icon}
                          alt="add file icon"
                        />
                        <p className={styles.button_name}>add files</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.save_changes_button_container}>
                    <button className={styles.save_changes_button}>
                      add content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT Content Modal */}
            {isEditContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeEditContentModal}
              >
                <div
                  className={`${styles.modal_content} ${styles.modal_content_container}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

                  <div className={styles.modal_content_header}>
                    <button
                      className={styles.header_close_button}
                      onClick={closeEditContentModal}
                    >
                      <img
                        src={modal_close_icon}
                        className={styles.header_close_icon}
                        alt="close icon"
                      />
                    </button>
                  </div>
                  <div className={styles.modal_content_info_container}>
                    <div className={styles.subheader_container}>
                      <img
                        src={edit_content_icon}
                        className={styles.subheader_icon}
                        alt="edit content icon"
                      />
                      <h2 className={styles.subheader_description}>
                        Edit Content
                      </h2>
                    </div>

                    <input
                      type="text"
                      className={`${styles.modal_content_input} ${styles.modal_content_text}`}
                      name="title"
                      id="title"
                      placeholder="Title"
                    />

                    <textarea
                      name="description"
                      id="description"
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                      placeholder="Write description here..."
                    ></textarea>

                    <select
                      name="subject"
                      id="subject"
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value="">Subject</option>
                      <option value="Software Engineering II">
                        Software Engineering II
                      </option>
                      <option value="Computer Programming I">
                        Computer Programming I
                      </option>
                    </select>

                    <select
                      name="program"
                      id="program"
                      className={`${styles.modal_content_input} ${styles.modal_content_select}`}
                    >
                      <option value="">Program</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                    </select>

                    <textarea
                      name="keyword"
                      id="keyword"
                      placeholder="Write keywords here..."
                      className={`${styles.modal_content_input} ${styles.modal_content_textarea}`}
                    ></textarea>

                    <div className={styles.modal_file_container}>
                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        {" "}
                        {/* Dito yung mga uploaded files */}
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_white}`}
                      >
                        <img
                          src={file_icon_white}
                          className={`${styles.file_icon}`}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_white}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div
                        className={`${styles.file} ${styles.file_icon_black}`}
                      >
                        <img
                          src={file_icon_black}
                          className={`${styles.file_icon} `}
                          alt="file icon"
                        />
                        <p className={styles.file_name}>CP1_Arrays</p>
                        <img
                          src={delete_file_icon_black}
                          className={styles.file_icon}
                          alt="remove file icon"
                        />
                      </div>

                      <div className={`${styles.file} ${styles.add_file}`}>
                        <img
                          src={add_file_icon}
                          className={styles.file_icon}
                          alt="add file icon"
                        />
                        <p className={styles.button_name}>add files</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.save_changes_button_container}>
                    <button className={styles.save_changes_button}>
                      add content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ARCHIVE Content Modal */}
            {isArchiveContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeArchiveContentModal}
              >
                <div
                  className={`${styles.archive_and_delete_content_container}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

                  <div className={styles.archive_and_delete_content_header}>
                    <button
                      className={styles.header_close_button}
                      onClick={closeArchiveContentModal}
                    >
                      <img
                        src={modal_close_icon}
                        className={styles.header_close_icon}
                        alt="close icon"
                      />
                    </button>
                  </div>

                  <div className={styles.subheader_container}>
                    <img
                      src={archive_content_icon}
                      className={styles.subheader_icon}
                      alt="archive content icon"
                    />
                    <h2 className={styles.subheader_description}>
                      archive content
                    </h2>
                  </div>

                  {currentStepArchive === 1 && (
                    <>
                      <div className={styles.archive_and_delete_content}>
                        <p className={styles.archive_and_delete_confirmation}>
                          Are you sure you want to archive ‘Arrays’? Type
                          ‘Arrays’ to confirm.
                        </p>

                        <div
                          className={
                            styles.confirm_archive_and_delete_container
                          }
                        >
                          <input
                            type="text"
                            name="archive"
                            id="archive"
                            className={`${styles.confirm_textbox} ${styles.confirm}`}
                          />
                          <button
                            className={`${styles.confirm_button} ${styles.confirm}`}
                            onClick={nextStepArchive}
                          >
                            confirm
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {currentStepArchive === 2 && (
                    <>
                        <p className={styles.archive_and_delete_confirmation}>
                          Archived ‘Arrays’ successfully.
                        </p>

                        <div className={styles.view_button_container}>
                          <button
                            className={`${styles.view_archived_contents_button}`}
                          >
                            view archived contents
                          </button>
                        </div>
      
                    </>
                  )}
                </div>
              </div>
            )}


            {/* Delete Content Modal */}
            {isDeleteContentModalOpen && (
              <div
                className={styles.modal_overlay}
                onClick={closeDeleteContentModal}
              >
                <div
                  className={`${styles.archive_and_delete_content_container}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                  {/* Modal Content Here */}

                  <div className={styles.archive_and_delete_content_header}>
                    <button
                      className={styles.header_close_button}
                      onClick={closeDeleteContentModal}
                    >
                      <img
                        src={modal_close_icon}
                        className={styles.header_close_icon}
                        alt="close icon"
                      />
                    </button>
                  </div>

                  <div className={styles.subheader_container}>
                    <img
                      src={delte_content_icon}
                      className={styles.subheader_icon}
                      alt="delete content icon"
                    />
                    <h2 className={styles.subheader_description}>
                      delete content
                    </h2>
                  </div>

                  {currentStepDelete === 1 && (
                    <>
                      <div className={styles.archive_and_delete_content}>
                        <p className={styles.archive_and_delete_confirmation}>
                        Are you sure you want to delete ‘Network Topologies’? Type ‘Network Topologies’ to confirm.
                        </p>

                        <div
                          className={
                            styles.confirm_archive_and_delete_container
                          }
                        >
                          <input
                            type="text"
                            name="archive"
                            id="archive"
                            className={`${styles.confirm_textbox} ${styles.confirm}`}
                          />
                          <button
                            className={`${styles.confirm_button} ${styles.confirm}`}
                            onClick={nextStepDelete}
                          >
                            confirm
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {currentStepDelete === 2 && (
                    <>
                        <p className={styles.archive_and_delete_confirmation}>
                          Deleted ‘Network Topologies’ successfully.
                        </p>

                        <div className={styles.view_button_container}>
                          <button
                            className={`${styles.view_archived_contents_button}`}
                          >
                            view deleted contents
                          </button>
                        </div>
      
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
