import React, { useState } from 'react';
import styles from './RegisterLogin.module.css';
import logo from '../../assets/logo2.svg';

function RegisterLogin() {
  
  // Logic for changing forms
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={logo} alt="This is our logo" className={styles.logo} />

        {/* Conditional Rendering for Sign-Up Form */}
        {isSignUp && (
          <div className={styles.signup_content} id="signup">
            <h2 className={styles.title}>Sign Up</h2>
            <div className={styles.signup_fields}>
              <input type="text" className={styles.input_field} placeholder="Enter your email" />
              <input type="text" className={styles.input_field} placeholder="Create your password" />
              <input type="text" className={styles.input_field} placeholder="Confirm your password" />
            </div>
            <div className={styles.signup_radio_container}>
              <h4 className={styles.signup_radio_title}>Sign Up as</h4>
              <div className={styles.signup_radio_buttons_container}>
                <div className={styles.radio_field}>
                  <label>
                    <input type="radio" name="role" value="student" />
                    student
                  </label>
                </div>
                <div className={styles.radio_field}>
                  <label>
                    <input type="radio" name="role" value="instructor" />
                    educator
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.signup_button_container}>
              <button type="submit" className={styles.signup_button}>
                Sign Up
              </button>
            </div>

            <div className={styles.dont_have_an_account_container}>
               <p className={styles.dont_have_an_account}>Already have an account?  
                  <span className={styles.dont_have_an_account_sign_up} onClick={toggleForm}>
                   Log In. 
                 </span>
               </p>
             </div>
          </div>
        )}

        {/* Conditional Rendering for Login Form */}
        {!isSignUp && (
          <div className={styles.login_content} id="login">
            <h2 className={styles.title}>Log In</h2>
            <div className={styles.signup_fields}>
              <input type="text" className={styles.input_field} placeholder="Enter email" />
              <input type="text" className={styles.input_field} placeholder="Enter password" />
            </div>
            <div className={styles.login_button_container}>
              <button type="submit" className={styles.login_button}>
                Log In
              </button>
            </div>
            <div className={styles.forgot_password_container}>
              <a href="#" className={styles.forgot_password}>
                Forgot Password?
              </a>
            </div>
            <div className={styles.dont_have_an_account_container}>
               <p className={styles.dont_have_an_account}>Don't have an account?  
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

