import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'
import Header from '../Header/Header'
import home_logo from '../../assets/logo2.svg'
import search_icon from '../../assets/search-icon.png'
import download_icon from '../../assets/download_icon.png'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState('');
  const [ searchValue, setSearchValue ] = useState('');  

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

  // api to pass searchValue to backend and to search results
  const handleSearch = async () => {
    if(!searchValue.trim() || searchValue === ""){
      toast.error("Please enter a search term to continue.", {
        autoClose: 2000
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/saveToSearchHistory", { searchValue });
        if(res.data.message === "Success"){
          navigate(`/search-results/${searchValue}`);
          toast.dismiss();
        } else {
          toast.error(res.data.message, {
            autoClose: 2000
          });
        }
    } catch (error) {
      console.error("Error searching", error);
      toast.error("An error occurred. Please try again later.", {
        autoClose: 2000
      });
    }
  };

  const handleCreateDocument = () => {
    navigate('/create-document?section=document');
  };

  const handleCreatePresentation = () => {
    navigate('/create-document?section=presentation');
  };

  return (
    <div className={styles.container}>
      <ToastContainer position='top-center' />
      <div className={styles.home_header_container}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.main_content}>
        <div className={styles.logo_container}>
          <img src={home_logo} className={styles.logo} alt="This is the logo" />
        </div>
        <div className={styles.content_search_bar_container}>
            <input
              type="text"
              className={styles.content_search_bar}
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className={styles.search_button} onClick={handleSearch}>
              <img src={search_icon} className={styles.search_icon} alt="This is a search icon" />
            </button>
        </div>  
        {userRole === "Educator" ? (
          <div className={styles.action_buttons_container}>
          <button onClick={handleCreateDocument} className={styles.action_button}>
            create document
          </button>
          <button onClick={handleCreatePresentation} className={styles.action_button}>
            create presentation
          </button>
          <button  className={styles.action_button}>
            upload content
          </button>
        </div>
        ) : ('')}        
        </div>
      </div>
      <div className={styles.downloaded_contents_button_container}>
          <button className={styles.download_contents_button}>
            <img src={download_icon} className={styles.download_contents_icon} alt="This is the download icon" />
            view downloaded contents
          </button>
        </div>
    </div>
  )
}

export default Home