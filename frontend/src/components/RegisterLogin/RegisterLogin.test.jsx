import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterLogin from "../RegisterLogin/RegisterLogin.jsx";
import { BrowserRouter as Router } from "react-router-dom";

describe("Unit Testing for RegisterLogin Component", () => {
  describe("Sign Up", () => {
    test("Renders the logo image, Sign Up text, and three input types with correct placeholders.", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const logoImage = screen.getByAltText(/This is our logo/i);
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute("src");

      const signUpElements = screen.getAllByText(/Sign Up/i);
      expect(signUpElements.length).toBeGreaterThan(0);

      expect(
        screen.getByPlaceholderText(/Enter your email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Create your password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Confirm your password/i)
      ).toBeInTheDocument();
    });

    test("Renders the Sign Up as text and two radio buttons", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      expect(screen.getByText(/Sign Up as/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/student/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/educator/i)).toBeInTheDocument();
    });

    test("Handles radio button selection for account role", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const studentRadio = screen.getByLabelText(/student/i);
      const educatorRadio = screen.getByLabelText(/educator/i);

      expect(studentRadio.checked).toBe(false);
      expect(educatorRadio.checked).toBe(false);

      fireEvent.click(studentRadio);

      expect(studentRadio.checked).toBe(true);
      expect(educatorRadio.checked).toBe(false);

      fireEvent.click(educatorRadio);

      expect(educatorRadio.checked).toBe(true);
      expect(studentRadio.checked).toBe(false);
    });

    test("Renders the SIGN UP button", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const button = screen.getByRole("button", { name: /Sign Up/i });
      expect(button).toBeInTheDocument();
    });

    test('Renders the correct text for "Already have an account? Log In."', () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Log In.")).toBeInTheDocument();
    });

    test("Handles the toggling of the form from 'Sign Up' to 'Log In' when Log In is clicked", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const signUpTextElements = screen.getAllByText(/Sign Up/i);
      expect(signUpTextElements[0]).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Log In/i));

      const loginTextElements = screen.getAllByText(/Log In/i);
      expect(loginTextElements[0]).toBeInTheDocument();
    });

    test("Handles input change for email, password, and confirm password.", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput =
        screen.getByPlaceholderText(/Create your password/i);
      const confirmPasswordInput = screen.getByPlaceholderText(
        /Confirm your password/i
      );

      fireEvent.change(emailInput, { target: { value: "login@example.com" } });
      fireEvent.change(passwordInput, {
        target: { value: "loginpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "loginpassword123" },
      });

      expect(emailInput.value).toBe("login@example.com");
      expect(passwordInput.value).toBe("loginpassword123");
      expect(confirmPasswordInput.value).toBe("loginpassword123");
    });
  });

  describe("Log In", () => {
    test("Renders logo image, Log In text, and two input types with correct placeholders.", () => {
      window.history.pushState({}, "", "?form=login");

      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const logoImage = screen.getByAltText(/This is our logo/i);
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute("src");

      const LoginElements = screen.getAllByText(/Log In/i);
      expect(LoginElements.length).toBeGreaterThan(0);

      const emailInput = screen.getByPlaceholderText(/Enter email/i);
      expect(emailInput).toBeInTheDocument();

      const passwordInput = screen.getByPlaceholderText(/Enter password/i);
      expect(passwordInput).toBeInTheDocument();
    });

    test("Renders the LOG IN button", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const button = screen.getByRole("button", { name: /Log In/i });
      expect(button).toBeInTheDocument();
    });

    test('Renders "Forgot Password?"', () => {
      window.history.pushState({}, "", "?form=login");

      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
    });

    test("Redirects to the correct route when Forgot Password is clicked", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const forgotPasswordLink = screen.getByText(/Forgot Password\?/i);
      fireEvent.click(forgotPasswordLink);

      expect(window.location.pathname).toBe("/forgotpassword");
    });

    test('Renders "Don\'t have an account? Sign Up."', () => {
      window.history.pushState({}, "", "?form=login");

      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText("Sign Up.")).toBeInTheDocument();
    });

    test("Handles the toggling of the form from 'Log In' to 'Sign Up' when Sign Up is clicked", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const logInTextElements = screen.getAllByText(/Log In/i);
      expect(logInTextElements[0]).toBeInTheDocument();

      fireEvent.click(screen.getByText(/Sign Up/i));

      const signUpTextElements = screen.getAllByText(/Sign Up/i);
      expect(signUpTextElements[0]).toBeInTheDocument();
    });

    test("Handles input change for email and password", () => {
      render(
        <Router>
          <RegisterLogin />
        </Router>
      );

      const emailInput = screen.getByPlaceholderText(/Enter email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter password/i);

      fireEvent.change(emailInput, { target: { value: "login@example.com" } });
      fireEvent.change(passwordInput, {
        target: { value: "loginpassword123" },
      });

      expect(emailInput.value).toBe("login@example.com");
      expect(passwordInput.value).toBe("loginpassword123");
    });
  });
});
