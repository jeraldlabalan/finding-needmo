import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import lock_icon from "../../assets/lock.png";
import { Link } from "react-router-dom";
import verified_icon from '../../assets/verified_icon.png'

function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className={styles.container}>
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
                type="text"
                name="email"
                id="email"
                className={styles.input_field}
                placeholder="Enter email"
              />
            </div>

            <div className={styles.forgot_password_button_container}>
              <button
                className={styles.forgot_password_button}
                onClick={nextStep}
              >
                forgot my password
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
              <p className={styles.step2_subtitle_email}>
                elainequisquino@gmail.com
              </p>
            </div>

            <div className={styles.step2_instruction_container}>
              <p className={styles.step2_instruction}>
                Please check your inbox and enter the verification code. The
                code will expire in
                <span className={styles.step2_instruction_time}>5:00</span>
              </p>
            </div>
            <div className={styles.step2_input_container}>
              <h3 className={styles.input_title}>Enter PIN</h3>
              <input
                type="text"
                className={styles.step2_verification_input_field}
              />
            </div>
            <div className={styles.step2_verify_button}>
              <button
                type="submit"
                className={styles.verify_button}
                onClick={nextStep}
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
              <p className={styles.step3_subtitle}>
                enter your new password
              </p>
            </div>

            <div className={styles.step3_input_field_container}>
              <input
                type="password"
                name="new_password"
                id="new_password"
                className={styles.step3_input_field}
                placeholder="New Password"
              />
            </div>

            <div className={styles.step3_input_field_container}>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                className={styles.step3_input_field}
                placeholder="Confirm Password"
              />
            </div>

            <div className={styles.step3_reset_password_container}>
              <button
                className={styles.step3_reset_password}
                onClick={nextStep}
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
              <h2 className={styles.step3_title}>reset your password</h2>
            </div>

            <div className={styles.step3_subtitle_container}>
              <p className={styles.step3_subtitle}>
                your password has been changed successfully!
              </p>
            </div>

            <div className={styles.forgot_password_button_container}>
              
              <Link to="/registerlogin?form=login" className={styles.go_to_login_button}>
              <button
                className={styles.go_to_login_button}
              >
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
