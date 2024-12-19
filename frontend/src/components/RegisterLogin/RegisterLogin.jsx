import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './RegisterLogin.module.css';
import logo from '../../assets/logo2.svg';
import email_icon from '../../assets/email.png'
import verified_icon from '../../assets/verified_icon.png'
import axios from 'axios';


function RegisterLogin() {

  const location = useLocation(); // Get current location object

  const [isSignUp, setIsSignUp] = useState(true); // Default form is Sign Up

  const [signUpValues, setSignUpValues] = useState({
    accRole: '',
    email: '',
    password: '',
    confirmPass: '',
    pin: '',
  });

  const [loginValues, setLoginValues] = useState({
    loginEmail: '',
    loginPass: '',
  });


  // Verification Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Enter PIN, Step 2: Success message
  const navigate = useNavigate();


  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(1); // Reset to step 1 when modal opens
  };


  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoToLogin = () => {
    closeModal(); // Close the modal
    navigate('/registerlogin?form=login'); // Redirect to login form
  };


  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8080')
      .then(res => {
        if (res.data.valid) {
          if (res.data.role === 'Student') {
            navigate('/home');
          } else if (res.data.role === 'Educator') {
            navigate('/home');
          }
        } else {
          navigate('/registerlogin?form=login');
        }
      })
      .catch(err => alert("Error: " + err))
  }, []);

  const submitLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/login', loginValues)
      .then((res) => {
        if (res.data.isLoggedIn) {
          const role = res.data.role;

          if (role === 'Student') {
            navigate('/home');
          } else if (role === 'Educator') {
            navigate('/home');
          } else {
            navigate('/registerlogin?form=login'); // Fallback route if role is not recognized
          }
        } else if (res.data.isLoggedIn === false) {
          alert(res.data.message);
          res.data.isLoggedIn = false;
        }
      })
      .catch((err) => {
        alert("Error logging in: " + err);
        console.error(err);
      });
  };


  // Handle PIN submission
  const handleVerifyPin = async () => {
    const pin = signUpValues.pin.trim();
    if (!pin || pin.length !== 6) return alert("Please enter the correct 6-digit PIN.");

    try {
      const response = await axios.post('http://localhost:8080/verifyPin', signUpValues);

      if (response.data.message === "Verified") {
        const response1 = await axios.post('http://localhost:8080/submitSignUp', signUpValues);
        if (response1.data.message === "Sign up credentials and profile saved successfully") {
          closeModal();
          navigate('/registerlogin?form=login');
          setIsModalOpen(true);
          setCurrentStep(2);

          setSignUpValues({
            accRole: '',
            email: '',
            password: '',
            confirmPass: '',
            pin: '',
          });
        } else {
          alert(response1.data.message);
          setSignUpValues({
            accRole: '',
            email: '',
            password: '',
            confirmPass: '',
            pin: '',
          });
        }
      } else {
        alert(response.data.message);
        setSignUpValues({
          accRole: '',
          email: '',
          password: '',
          confirmPass: '',
          pin: '',
        });
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
      setSignUpValues({
        accRole: '',
        email: '',
        password: '',
        confirmPass: '',
        pin: '',
      });
    }
  };

  const submitEmailPass = () => {
    if (signUpValues.password !== signUpValues.confirmPass) {
      alert("Passwords don't match");
    } else if (!signUpValues.password || signUpValues.password === "" || !signUpValues.confirmPass || signUpValues.confirmPass === "") {
      alert("Password is required");
    } else {
      if (signUpValues.accRole === "Educator") {
        const email = signUpValues.email.trim();

        // Regex for dcs-prefixed email format
        const validEmailRegex = /^dcs\.[a-zA-Z]+\.[a-zA-Z]+@cvsu\.edu\.ph$/;

        if (!validEmailRegex.test(email)) {
          alert("Please enter a valid email in the format: dcs.firstname.lastname@cvsu.edu.ph");
          return;
        } else {
          axios.post('http://localhost:8080/sendPin', { email: signUpValues.email })
            .then((res) => {
              if (res.data.message === "Verification code sent. Check your email.") {

                openModal(); // Triggers Verification Modal

                alert(res.data.message);

                console.log(signUpValues.accRole);
              } else {
                alert(res.data.message);
              }
            })
            .catch((err) => {
              alert("Error: " + err);
            })
        }
      } else if (signUpValues.accRole === "Student") {
        axios.post('http://localhost:8080/sendPin', { email: signUpValues.email })
          .then((res) => {
            if (res.data.message === "Verification code sent. Check your email.") {

              openModal(); // Triggers Verification Modal

              alert(res.data.message);

              console.log(signUpValues.accRole);
            } else {
              alert(res.data.message);
            }
          })
          .catch((err) => {
            alert("Error: " + err);
          })
      }
    }
  }

  const handleSignUpOnChange = (e) => {
    const { name, value } = e.target;
    setSignUpValues({ ...signUpValues, [name]: value })
  }

  const handleLoginOnChange = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value })
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
              <input type="text"
                name="email" value={signUpValues.email} className={styles.input_field} onChange={handleSignUpOnChange} placeholder="Enter your email" required />
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
              <input type="text" name='loginEmail' onChange={handleLoginOnChange} className={styles.input_field} placeholder="Enter email" />
              <input type="password" name='loginPass' onChange={handleLoginOnChange} className={styles.input_field} placeholder="Enter password" />
            </div>
            <div className={styles.login_button_container}>
              <button type="submit" className={styles.login_button} onClick={submitLogin}>Log In</button>
            </div>
            <div className={styles.forgot_password_container}>
              <Link to="/forgotpassword" className={styles.forgot_password}>
                Forgot Password?
              </Link>
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

        {/* Modal */}
        {isModalOpen && (
          <div className={styles.verify_modal_overlay} onClick={closeModal}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
              <div className={styles.close_button_container}>
                <button className={styles.close_button} onClick={closeModal}>
                  <i className="fa-solid fa-x"></i>
                </button>
              </div>
              {currentStep === 1 && (
                <>
                  <div className={styles.modal_title_container}>
                    <img src={email_icon} className={styles.email_icon} alt="Email icon" />
                    <h2 className={styles.modal_title}>Verify Your Email Address</h2>
                  </div>


                  <div className={styles.modal_subtitle_container}>
                    <p className={styles.modal_subtitle}>
                      A verification code has been sent to
                    </p>
                    <p className={styles.modal_subtitle_email}>{signUpValues.email}</p>
                  </div>
                  <div className={styles.modal_instruction_container}>
                    <p className={styles.modal_instruction}>
                      Please check your inbox and enter the verification code. The code will expire in
                      <span className={styles.modal_instruction_time}>5 minutes</span>
                    </p>
                  </div>
                  <div className={styles.modal_input_container}>
                    <h3 className={styles.input_title}>Enter PIN</h3>
                    <input
                      type="tel"
                      name='pin'
                      className={styles.verification_input_field}
                      value={signUpValues.pin}
                      onChange={handleSignUpOnChange}
                    />
                  </div>
                  <div className={styles.modal_verify_button}>
                    <button type="submit" className={styles.verify_button} onClick={handleVerifyPin}>Verify</button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className={styles.success_message_container}>
                  <div className={styles.modal_title_container}>
                    <img src={verified_icon} className={styles.verified_icon} alt="Email icon" />
                    <h2 className={styles.modal_title}>ACCOUNT VERIFIED SUCCESSFULLY</h2>
                  </div>

                  <div className={styles.modal_subtitle_container}>
                    <p className={styles.modal_subtitle}>
                      Your email has been successfully verified!
                    </p>
                  </div>

                  <button className={styles.back_to_login} onClick={handleGoToLogin}>
                    Go To Login
                  </button>

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterLogin;
