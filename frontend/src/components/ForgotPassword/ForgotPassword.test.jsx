import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
import axios from "axios";

jest.mock("axios");

describe("Unit Testing for Forgot Password Component", () => {
  beforeEach(() => {
    render(<ForgotPassword />);
  });

  test("Should render the lock icon", () => {
    const lockIcon = screen.getByAltText(/lock icon/i);
    expect(lockIcon).toBeInTheDocument();
  });

  test('Should render the "TROUBLE LOGGING IN?"', () => {
    const title = screen.getByText(/TROUBLE LOGGING IN?/i);
    expect(title).toBeInTheDocument();
  });

  test("Should render the subtitle", () => {
    const subtitle = screen.getByText(
      /Enter your email and we'll send you an OTP to get back into your account./i
    );
    expect(subtitle).toBeInTheDocument();
  });

  test("Should render the email input field", () => {
    const emailInput = screen.getByPlaceholderText(/Enter email/i);
    expect(emailInput).toBeInTheDocument();
  });

  test("Should update email input value when typing", () => {
    const emailInput = screen.getByPlaceholderText(/Enter email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  test('Should submit email when the "FORGOT PASSWORD" button is clicked', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Verification code sent. Check your email." },
    });

    const emailInput = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const button = screen.getByText(/FORGOT PASSWORD/i);
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText("reset your password")).toBeInTheDocument()
    );
  });

  test("Should submit email and go to next step", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Verification code sent. Check your email." },
    });

    const emailInput = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const button = screen.getByText("forgot password");
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText("reset your password")).toBeInTheDocument()
    );
  });

  test("Should show an error if email is not entered", async () => {
    const button = screen.getByText("forgot password");
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText("Enter an email")).toBeInTheDocument()
    );
  });
});
