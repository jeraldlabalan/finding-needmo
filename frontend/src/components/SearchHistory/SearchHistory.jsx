import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SearchHistory.module.css";
import logo from "../../assets/logo.png";
import calendar_icon from "../../assets/calendar-icon.png";
import delete_search from "../../assets/close-icon-modal.png";
import trash_icon from "../../assets/delete-content-icon.png";
import SecondHeader from "../SecondHeader/SecondHeader";
import Header from "../Header/Header";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

function SearchHistory() {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState('');
  const calendarInputRef = useRef(null);
  const [isClearSearchModalOpen, setIsClearSearchModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [isClearSearchStepTwo, setIsClearSearchStepTwo] = useState(false);
  const [isAllStepTwo, setIsAllStepTwo] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setUserEmail(res.data.email);
          setUserRole(res.data.role);
        } else {
          navigate("/registerlogin");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

  const fetchSearchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/getSearchHistory");
      if (res.data.message === "Success") {
        const sortedHistory = res.data.searches.sort(
          (a, b) => new Date(b.SearchedAt) - new Date(a.SearchedAt)
        );
        setSearchHistory(sortedHistory);
        setFilteredHistory(sortedHistory);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };
  
  // Fetch search history when the component mounts
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const handleCalendarClick = () => {
    if (calendarInputRef.current) {
      calendarInputRef.current.showPicker(); // Modern approach to trigger date picker
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      // Filter the history based on the selected date
      const filtered = searchHistory.filter((entry) => {
        const entryDate = new Date(entry.SearchedAt).toISOString().split("T")[0]; // Extract date part from SearchedAt
        return entryDate === selectedDate;
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(searchHistory); // Show all history if no date is selected
    }
  };

  //Group search history by date
  const groupedHistory = filteredHistory.reduce((acc, entry) => {
    const searchedDate = new Date(entry.SearchedAt);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let groupKey;
    if (searchedDate.toDateString() === today) {
      groupKey = "Today";
    } else if (searchedDate.toDateString() === yesterdayString) {
      groupKey = "Yesterday";
    } else {
      groupKey = searchedDate.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(entry); // Store the entire entry object instead of just entry.Entry
    return acc;
  }, {});


  //delete one search
  const handleDeleteSearch = async (row) => {
    console.log("Deleting search with ID:", row.HistoryID);

    try {
      const res = await axios.post('http://localhost:8080/deleteASearch', { historyID: row.HistoryID });
      if (res.data.message === "Success") {
        setSearchHistory((prevHistory) => prevHistory.filter((entry) => entry.HistoryID !== row.HistoryID));
        setFilteredHistory((prevFiltered) => prevFiltered.filter((entry) => entry.HistoryID !== row.HistoryID));

        toast.success(`'${row.Entry}' deleted successfully`, {
          autoClose: 2000
        });
      } else {
        toast.error(`Failed to delete '${row.Entry}'. Please try again`, {
          autoClose: 2000
        })
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(`An error occurred. Please try again`, {
        autoClose: 2000
      })
    }
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

  //delete all searches
  const handleAllConfirm = async () => {

    try {
      const res = await axios.post('http://localhost:8080/deleteAllSearch');
      if (res.data.message === "Success") {
        setSearchHistory([]);
        setFilteredHistory([]);

        setIsAllStepTwo(true);
        toast.dismiss();
      } else {
        toast.error(`Failed to delete Searches. Please try again`, {
          autoClose: 2000
        })
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(`An error occurred. Please try again`, {
        autoClose: 2000
      })
    }
  };

  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const handleIconClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // Trigger the native date picker
    }
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  
  const handleClearSearchConfirm = async () => {
    if(!startDate || !endDate){
      toast.error(`Set start and end date`, {
        autoClose: 2000
      })
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/deleteSearchByDate', {
        startDate,
        endDate,
      });
  
      if (res.data.message === 'Success') {        
        await fetchSearchHistory();
        setIsClearSearchStepTwo(true);
        toast.dismiss();
      } else{
        toast.error(`Failed to delete Searches. Please try again`, {
          autoClose: 2000
        })
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(`An error occurred. Please try again`, {
        autoClose: 2000
      })
    }
  };


  return (
    <div className={styles.container}>
      <ToastContainer position='top-center' />
      <div className={styles.search_history_header}>
        <Header />
      </div>
      <Link to="/home" className={styles.search_history_logo}>
      <img src={logo} className={styles.search_history_logo} alt="logo" />
      </Link>
      <div className={styles.search_history_container}>
        <div className={styles.search_history_content_header}>
          <div className={styles.calendar_container}>
            <img
              src={calendar_icon}
              className={styles.calendar_icon}
              alt="Calendar Icon"
              onClick={handleCalendarClick} // Focus the calendar input on icon click
            />
            <input
              type="date"
              id="calendar-input"
              className={styles.calendar_input}
              ref={calendarInputRef}
              onChange={handleDateChange} // Filter history when date changes
            />
          </div>

          <div className={styles.search_history_action_buttons}>
            <button onClick={openClearSearchModal}>Clear Search</button>
            <button onClick={openAllModal}>All</button>
          </div>
        </div>

        <div className={styles.search_history_content}>
          {Object.entries(groupedHistory).map(([dateGroup, entries]) => (
            <div className={styles.search_history_item} key={dateGroup}>
              <h1>
                {dateGroup === "Today" || dateGroup === "Yesterday" ? (
                  dateGroup
                ) : (
                  <>
                    {dateGroup.split(",")[0]} {/* Month and Day */}
                    <span>,</span>
                    <span>{dateGroup.split(",")[1]}</span> {/* Year */}
                  </>
                )}
              </h1>
              <hr />
              <ul>
                {entries.map((entry, index) => (
                  <li key={index}>
                    <p>{entry.Entry}</p> {/* Assuming entry.Entry contains the search query */}
                    <button onClick={() => handleDeleteSearch(entry)} style={{ background: 'transparent' }}><img src={delete_search} alt="delete" /></button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
                    <span className={styles.label}>{startDate ? formatDate(startDate) : "Start Date"}</span>
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
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* End Date */}
                  <div className={styles.calendarContainer}>
                    <span className={styles.label}>{endDate ? formatDate(endDate) : "End Date"}</span>
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
                      onChange={(e) => setEndDate(e.target.value)}
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
