import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import lock_icon from "../../assets/lock.png";
import { Link } from "react-router-dom";
import verified_icon from "../../assets/verified_icon.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({
    email: "",
    otp: "",
    newPass: "",
    confirmPass: "",
  });

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  };

  //SEND OTP
  const submitEmail = async () => {
    console.log("Email:", values.email);

    if (!values.email || values.email === "") {
      return toast.error("Enter an email", {
        autoClose: 3000,
      });
    }
    try {
      const res1 = await axios.post("http://localhost:8080/sendOTP", values);
      if (res1.data.message === "Verification code sent. Check your email.") {
        setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
      } else {
        toast.error(res1.data.message, {
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Error: " + error, {
        autoClose: 4000,
      });
    }
  };

  //VERIFY OTP
  const verifyOTP = async () => {
    if (!values.otp || values.otp === "") {
      return toast.error("Please enter the correct 6-digit PIN.", {
        autoClose: 3000,
      });
    }

    try {
      const res1 = await axios.post("http://localhost:8080/verifyOTP", values);
      if (res1.data.message === "Verified") {
        setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
      } else {
        toast.error(res1.data.message, {
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Error: " + error, {
        autoClose: 4000,
      });
    }
  };

  //SAVE NEW PASSWORD
  const handleNewPass = async () => {
    if (values.newPass !== values.confirmPass) {
      toast.error("Passwords don't match");
    } else if (
      !values.newPass ||
      values.newPass === "" ||
      !values.confirmPass ||
      values.confirmPass === ""
    ) {
      toast.error("Password is required");
    } else {
      try {
        const res1 = await axios.post(
          "http://localhost:8080/resetPass",
          values
        );
        if (res1.data.message === "Password reset successfully.") {
          setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
          setValues({
            email: "",
            otp: "",
            newPass: "",
            confirmPass: "",
          });
        } else {
          toast.error(res1.data.message, {
            autoClose: 4000,
          });
        }
      } catch (error) {
        toast.error("Error: " + error, {
          autoClose: 4000,
        });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    toast.dismiss();
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" />
      <div className={styles.content_wrapper}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <>
            <div className={styles.trouble_logging_in_container}>
              <img
                src={lock_icon}
                className={styles.lock_icon}
                alt="lock icon"
              />
              <h2 className={styles.title}>trouble logging in?</h2>
            </div>

            <div className={styles.subtitle_container}>
              <p className={styles.subtitle}>
                Enter your email and we'll send you an OTP to get back into your
                account.
              </p>
            </div>

            <div className={styles.input_field_container}>
              <input
                type="email"
                name="email"
                id="email"
                className={styles.input_field}
                value={values.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>

            <div className={styles.forgot_password_button_container}>
              <button
                className={styles.forgot_password_button}
                onClick={submitEmail}
              >
                forgot password
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <>
            <div className={styles.step2_title_container}>
              <img
                src={lock_icon}
                className={styles.lock_icon}
                alt="Lock icon"
              />
              <h2 className={styles.step2_title}>reset your password</h2>
            </div>

            <div className={styles.step2_subtitle_container}>
              <p className={styles.step2_subtitle}>
                A verification code has been sent to
              </p>
              <p className={styles.step2_subtitle_email}>{values.email}</p>
            </div>

            <div className={styles.step2_instruction_container}>
              <p className={styles.step2_instruction}>
                Please check your inbox and enter the verification code. The
                code will expire in
                <span className={styles.step2_instruction_time}>5 minutes</span>
              </p>
            </div>
            <div className={styles.step2_input_container}>
              <h3 className={styles.input_title}>Enter PIN</h3>
              <input
                type="tel"
                name="otp"
                id="otp"
                className={styles.step2_verification_input_field}
                value={values.otp}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.step2_verify_button}>
              <button
                type="submit"
                className={styles.verify_button}
                onClick={verifyOTP}
              >
                Verify
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <>
            <div className={styles.step3_title_container}>
              <img
                src={lock_icon}
                className={styles.lock_icon}
                alt="Lock icon"
              />
              <h2 className={styles.step3_title}>reset your password</h2>
            </div>

            <div className={styles.step3_subtitle_container}>
              <p className={styles.step3_subtitle}>enter your new password</p>
            </div>

            <div className={styles.step3_input_field_container}>
              <input
                type="password"
                name="newPass"
                id="newPass"
                className={styles.step3_input_field}
                placeholder="New Password"
                value={values.newPass}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.step3_input_field_container}>
              <input
                type="password"
                name="confirmPass"
                id="confirmPass"
                className={styles.step3_input_field}
                placeholder="Confirm Password"
                value={values.confirmPass}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.step3_reset_password_container}>
              <button
                className={styles.step3_reset_password}
                onClick={handleNewPass}
              >
                Reset Password
              </button>
            </div>
          </>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <>
            <div className={styles.step3_title_container}>
              <img
                src={verified_icon}
                className={styles.lock_icon}
                alt="Lock icon"
              />
              <h2 className={styles.step3_title}>password changed</h2>
            </div>

            <div className={styles.step3_subtitle_container}>
              <p className={styles.step3_subtitle}>
                your password has been changed successfully!
              </p>
            </div>

            <div className={styles.forgot_password_button_container}>
              <Link
                to="/registerlogin?form=login"
                className={styles.go_to_login_button}
              >
                <button className={styles.go_to_login_button}>
                  Go to Login
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
