import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AccountSettings.module.css";
import Header from "../Header/Header";
import account_setting_icon from "../../assets/account-settings-icon.png";
import verify_icon_black from "../../assets/verify-icon-black.png";
import email_icon_white from "../../assets/email-icon-white.png";
import email_icon from "../../assets/email.png";
import verify_icon from "../../assets/verified_icon.png";
import logoutFunction from "../logoutFunction.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AccountSettings() {
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentChangeEmailStep, setCurrentChangeEmailStep] = useState(1);
  const [currentChangePasswordStep, setCurrentChangePasswordStep] = useState(1);
  const [emailData, setEmailData] = useState({
    password: "",
    email: "",
  });

  const [passData, setPassData] = useState({
    password: "",
    newPass: "",
    confirmNewPass: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

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
          console.log(res.data.role);
        } else {
          navigate("/registerlogin");
        }
      })
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

  const nextStep = () => {
    setCurrentChangePasswordStep((prev) => (prev < 3 ? prev + 1 : prev));
    setCurrentChangeEmailStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  // Handlers to navigate to forms
  const handleChangeEmail = () => {
    setSelectedForm("email"); // Go to Change Email Form
  };

  const handleChangePassword = () => {
    setSelectedForm("password"); // Go to Change Password Form
  };

  // cancel button logic
  const cancelForm = () => {
    setSelectedForm(null);
    setCurrentChangeEmailStep(1);
    setCurrentChangePasswordStep(1);

    setEmailData({
      password: "",
      email: "",
    });

    setPassData({
      password: "",
      newPass: "",
      confirmNewPass: "",
    });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //change email
  const handleVerifyPassword = () => {
    if (emailData.password === "" || !emailData.password) {
      toast.error("Input your password", {
        autoClose: 2000,
      });
      return;
    }

    axios
      .post("http://localhost:8080/verifyPassword/accSettings", {
        password: emailData.password,
      })
      .then((res) => {
        if (res.data.message === "Correct") {
          setCurrentChangeEmailStep((prev) => (prev < 3 ? prev + 1 : prev));
          toast.dismiss();
        } else {
          toast.error("Your password is wrong", {
            autoClose: 2000,
          });
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.", {
          autoClose: 2000,
        });
        console.log("Error: " + err);
      });
  };

  const handleSubmitNewEmail = () => {
    if (!emailData.email || emailData.email === "") {
      toast.error("Input your new email", {
        autoClose: 2000,
      });
      return;
    }

    if (userRole === "Educator") {
      const email = emailData.email.trim();

      // Regex for dcs-prefixed email format
      const validEmailRegex = /^dcs\.[a-zA-Z]+\.[a-zA-Z]+@cvsu\.edu\.ph$/;

      if (!validEmailRegex.test(email)) {
        toast.error(
          "Please enter a valid email in the format: dcs.firstname.lastname@cvsu.edu.ph"
        ),
          {
            autoClose: 2000,
          };
        return;
      }
    }

    axios
      .post("http://localhost:8080/changeEmail/accSettings", {
        email: emailData.email,
      })
      .then((res) => {
        if (res.data.message === "Success") {
          if (res.data.logout) {
            toast.dismiss();
            setCurrentChangeEmailStep((prev) => (prev < 3 ? prev + 1 : prev));

            setTimeout(() => {
              logoutFunction(navigate);
            }, 3000);
          }
        } else {
          toast.error(
            "Failed to change email. Kindly reload the page and try again.",
            {
              autoClose: 2000,
            }
          );
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.", {
          autoClose: 2000,
        });
        console.log("Error: " + err);
      });
  };

  //change password
  const handleVerifyPassword1 = () => {
    if (passData.password === "" || !passData.password) {
      toast.error("Input your password", {
        autoClose: 2000,
      });
      return;
    }

    axios
      .post("http://localhost:8080/verifyPassword/accSettings", {
        password: passData.password,
      })
      .then((res) => {
        if (res.data.message === "Correct") {
          setCurrentChangePasswordStep((prev) => (prev < 3 ? prev + 1 : prev));
          toast.dismiss();
        } else {
          toast.error("Your password is wrong", {
            autoClose: 2000,
          });
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.", {
          autoClose: 2000,
        });
        console.log("Error: " + err);
      });
  };

  const handleSubmitNewPass = () => {
    if (
      passData.newPass === "" ||
      !passData.newPass ||
      passData.confirmNewPass === "" ||
      !passData.confirmNewPass
    ) {
      toast.error("Both fields are required", {
        autoClose: 2000,
      });
      return;
    } else if (passData.newPass !== passData.confirmNewPass) {
      toast.error(`Passwords don't match`, {
        autoClose: 2000,
      });
      return;
    }

    axios
      .post("http://localhost:8080/changePass/accSettings", {
        confirmNewPass: passData.confirmNewPass,
      })
      .then((res) => {
        if (res.data.message === "Success") {
          setCurrentChangePasswordStep((prev) => (prev < 3 ? prev + 1 : prev));
          toast.dismiss();
        } else {
          toast.error(
            "Failed to change password. Kindly reload the page and try again.",
            {
              autoClose: 2000,
            }
          );
        }
      })
      .catch((err) => {
        toast.error("An error occurred. Please try again.", {
          autoClose: 2000,
        });
        console.log("Error: " + err);
      });
  };

  return (
    <div className={styles.container}>
      {!(currentChangeEmailStep === 3 || currentChangePasswordStep === 3) && (
        <Header />
      )}

      <div className={styles.main_content}>
        {/* main account setting page, dito pipili si user kung change email or change pass */}
        {selectedForm === null && (
          <>
            <div className={styles.content_upper}>
              <img
                src={account_setting_icon}
                className={styles.account_setting_icon}
                alt="account setting icon"
              />
              <h2 className={styles.content_upper_title}>account settings</h2>
            </div>

            <div className={styles.content_lower}>
              <div
                className={`${styles.option} ${styles.left_option}`}
                onClick={handleChangeEmail} // Redirect to Change Email
              >
                <img
                  src={email_icon_white}
                  className={styles.option_icon}
                  alt="email icon"
                />
                <h3 className={styles.option_title}>
                  change your <br /> email
                </h3>
                <p className={styles.option_subtitle}>
                  Change your email and we’ll send an OTP.
                </p>
              </div>

              <div
                className={`${styles.option} ${styles.right_option}`}
                onClick={handleChangePassword} // Redirect to Change Password
              >
                <img
                  src={verify_icon_black}
                  className={styles.option_icon}
                  alt="verify icon"
                />
                <h3 className={styles.option_title}>
                  change your <br /> password
                </h3>
                <p className={styles.option_subtitle}>
                  Change your password and we’ll send an OTP.
                </p>
              </div>
            </div>
          </>
        )}

        {/* kapag pinili yung change email */}
        {selectedForm === "email" && currentChangeEmailStep === 1 && (
          <div className={styles.change_email_form}>
            <div className={styles.reusable_verify_password_form}>
              <div className={styles.content_title_container}>
                <img
                  src={account_setting_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>verify your password</h2>
                <p className={styles.content_subtitle}>
                  Re-enter your Finding NeedMo password to continue.
                </p>
              </div>
              <div className={styles.password_field_container}>
                <input
                  type="password"
                  value={emailData.password}
                  name="password"
                  onChange={handleEmailChange}
                  className={styles.password_field}
                  placeholder="Password"
                />
              </div>
              <div className={styles.nav_buttons_container}>
                <button
                  className={`${styles.button_next} ${styles.button}`}
                  onClick={handleVerifyPassword}
                >
                  next
                </button>
                <button
                  className={`${styles.button_cancel} ${styles.button}`}
                  onClick={cancelForm}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedForm === "email" && currentChangeEmailStep === 2 && (
          <div className={styles.change_email_form}>
            <div className={styles.email_form_container}>
              <div className={styles.content_title_container}>
                <img
                  src={email_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>change email</h2>
                <p className={styles.content_subtitle}>
                  Your current email is{" "}
                  <span className={styles.bolded_text}>{userEmail}</span>.{" "}
                  <br />
                  What would you like it to update to?
                </p>
              </div>
              <div className={styles.email_field_container}>
                <input
                  value={emailData.email}
                  name="email"
                  onChange={handleEmailChange}
                  className={styles.email_field}
                  placeholder="New email address"
                />
              </div>
              <div className={styles.nav_buttons_container}>
                <button
                  className={`${styles.button_next} ${styles.button}`}
                  onClick={handleSubmitNewEmail}
                >
                  next
                </button>
                <button
                  className={`${styles.button_cancel} ${styles.button}`}
                  onClick={cancelForm}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedForm === "email" && currentChangeEmailStep === 3 && (
          <div className={styles.change_email_form}>
            <div className={styles.reusable_sucess_form}>
              <div className={styles.content_title_container}>
                <img
                  src={email_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>email address changed!</h2>
                <p className={styles.content_subtitle}>
                  Your email address has been successfully <br />
                  changed to{" "}
                  <span className={styles.bolded_text}>{emailData.email}</span>.
                  Logging out in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* kapag pinili yung change password  */}
        {selectedForm === "password" && currentChangePasswordStep === 1 && (
          <div className={styles.change_password_form}>
            <div className={styles.reusable_verify_password_form}>
              <div className={styles.content_title_container}>
                <img
                  src={account_setting_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>verify your password</h2>
                <p className={styles.content_subtitle}>
                  Re-enter your Finding NeedMo password to continue.
                </p>
              </div>
              <div className={styles.password_field_container}>
                <input
                  type="password"
                  value={passData.email}
                  name="password"
                  onChange={handlePassChange}
                  className={styles.password_field}
                  placeholder="Password"
                />
              </div>
              <div className={styles.nav_buttons_container}>
                <button
                  className={`${styles.button_next} ${styles.button}`}
                  onClick={handleVerifyPassword1}
                >
                  next
                </button>
                <button
                  className={`${styles.button_cancel} ${styles.button}`}
                  onClick={cancelForm}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedForm === "password" && currentChangePasswordStep === 2 && (
          <div className={styles.change_password_form}>
            <div className={styles.password_form_container}>
              <div className={styles.content_title_container}>
                <img
                  src={verify_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>change password</h2>
                <p className={styles.content_subtitle_password}>
                  Ensure the new password matches the confirmation password.
                </p>
              </div>
              <div className={styles.password_field_field_container}>
                <input
                  type="password"
                  value={passData.newPass}
                  name="newPass"
                  onChange={handlePassChange}
                  className={styles.password_field}
                  placeholder="New password"
                />

                <input
                  type="password"
                  value={passData.confirmNewPass}
                  name="confirmNewPass"
                  onChange={handlePassChange}
                  className={styles.password_field}
                  placeholder="Confirm new password"
                />
              </div>
              <div className={styles.nav_buttons_container}>
                <button
                  className={`${styles.button_next} ${styles.button}`}
                  onClick={handleSubmitNewPass}
                >
                  update password
                </button>
                <button
                  className={`${styles.button_cancel} ${styles.button}`}
                  onClick={cancelForm}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedForm === "password" && currentChangePasswordStep === 3 && (
          <div className={styles.change_password_form}>
            <div className={styles.reusable_sucess_form}>
              <div className={styles.content_title_container}>
                <img
                  src={verify_icon}
                  className={styles.account_setting_icon}
                  alt="account settings icon"
                />
                <h2 className={styles.content_title}>password changed!</h2>
                <p className={styles.content_subtitle}>
                  Your password has been successfully updated.
                </p>
              </div>
              <div className={styles.nav_buttons_container}>
                <button
                  className={`${styles.button_go_back} ${styles.button}`}
                  onClick={cancelForm}
                >
                  go back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
