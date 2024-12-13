import React, { useState, useEffect } from 'react';
import styles from './RegisterLogin.module.css';
import logo from '../../assets/logo2.svg';
import { useLocation } from 'react-router-dom'; // Import useLocation for query params
import axios from 'axios';

function RegisterLogin() {

  const location = useLocation(); // Get current location object
  const [isSignUp, setIsSignUp] = useState(true); // Default form is Sign Up
  const [signUpValues, setSignUpValues] = useState({
    accRole: '',
    email: '',
    password: '',
    confirmPass: '',
  });

  const submitEmailPass = () =>{
    if(signUpValues.password !== signUpValues.confirmPass){
      alert("Passwords don't match");
    } else if(!signUpValues.password || signUpValues.password === "" || !signUpValues.confirmPass || signUpValues.confirmPass === "" ){
      alert("Password is required");
    } else{

      axios.post('http://localhost:8080/sendPin', {email: signUpValues.email})
      .then((res) => {
        if(res.data.message === "Verification code sent. Check your email."){
          //TODO: TRIGGER FOR EMAIL VERIFICATION POPUP/CONTAINER DITO
          alert(res.data.message);
          setSignUpValues({
            accRole: '',
            email: '',
            password: '',
            confirmPass: '',
          });

          console.log(signUpValues.accRole);
        } else{
          alert(res.data.message);
          setSignUpValues({
            accRole: '',
            email: '',
            password: '',
            confirmPass: '',
          });
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      })
    }
  }

  const handleSignUpOnChange = (e) => {
    const { name, value } = e.target;
    setSignUpValues({...signUpValues, [name]: value})
  }

   // Logic para ma-direct sa sign up or log in form kapag galing sa landing page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const formType = queryParams.get('form'); // 'login' or 'register'
    if (formType === 'login') setIsSignUp(false);
    if (formType === 'register') setIsSignUp(true);
  }, [location]);


  // Switching from sign up form to login form vice versa
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={logo} alt="This is our logo" className={styles.logo} />

        {/* Sign-Up Form */}
        {isSignUp && (
          <div className={styles.signup_content} id="signup">
            <h2 className={styles.title}>Sign Up</h2>
            <div className={styles.signup_fields}>
              <input type="text" name="email" value={signUpValues.email} className={styles.input_field} onChange={handleSignUpOnChange} placeholder="Enter your email" required />
              <input type="password" name="password" value={signUpValues.password} className={styles.input_field} onChange={handleSignUpOnChange} placeholder="Create your password" required />
              <input type="password" name="confirmPass" value={signUpValues.confirmPass} className={styles.input_field} onChange={handleSignUpOnChange} placeholder="Confirm your password" required />
            </div>
            <div className={styles.signup_radio_container}>
              <h4 className={styles.signup_radio_title}>Sign Up as</h4>
              <div className={styles.signup_radio_buttons_container}>
                <div className={styles.radio_field}>
                  <label>
                    <input type="radio" name="accRole" value="Student" checked={signUpValues.accRole === "Student"} onChange={handleSignUpOnChange} />
                    student
                  </label>
                </div>
                <div className={styles.radio_field}>
                  <label>
                    <input type="radio" name="accRole" value="Educator" checked={signUpValues.accRole === "Educator"} onChange={handleSignUpOnChange} />
                    educator
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.signup_button_container}>
              <button type="submit" onClick={submitEmailPass} className={styles.signup_button}>Sign Up</button>
            </div>

            <div className={styles.dont_have_an_account_container}>
              <p className={styles.dont_have_an_account}>
                Already have an account?  
                <span className={styles.dont_have_an_account_sign_up} onClick={toggleForm}>
                  Log In.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        {!isSignUp && (
          <div className={styles.login_content} id="login">
            <h2 className={styles.title}>Log In</h2>
            <div className={styles.signup_fields}>
              <input type="text" className={styles.input_field} placeholder="Enter email" />
              <input type="text" className={styles.input_field} placeholder="Enter password" />
            </div>
            <div className={styles.login_button_container}>
              <button type="submit" className={styles.login_button}>Log In</button>
            </div>
            <div className={styles.forgot_password_container}>
              <a href="#" className={styles.forgot_password}>
                Forgot Password?
              </a>
            </div>
            <div className={styles.dont_have_an_account_container}>
              <p className={styles.dont_have_an_account}>
                Don't have an account?  
                <span className={styles.dont_have_an_account_sign_up} onClick={toggleForm}>
                  Sign Up.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterLogin;
