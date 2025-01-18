const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

jest.mock("mysql");
jest.mock("nodemailer");

const app = express();
app.use(express.json());

const PIN_EXPIRATION_TIME = 5 * 60 * 1000;
let verificationPins = {};

app.post("/sendOTP", (req, res) => {
  const email = req.body.email;
  const emailQuery = `SELECT * FROM user WHERE Email = ?`;
  mysql
    .createConnection()
    .query(emailQuery, req.body.email, (err, emailRes) => {
      if (err) {
        return res.json({ message: "Error in server: " + err });
      } else if (emailRes.length > 0) {
        const randomPin = Math.floor(100000 + Math.random() * 900000);
        verificationPins[email] = { pin: randomPin, createdAt: Date.now() };

        const emailBody = `
            We received a request to reset the password for your account.

            CODE: ${randomPin}

            If you didn't make the request, ignore this email. Otherwise, you can reset your password.`;

        const mailOptions = {
          from: "virtualangel921@gmail.com",
          to: email,
          subject: "Password Reset Verification Code",
          text: emailBody,
        };

        try {
          nodemailer.createTransport().sendMail(mailOptions);
          return res.json({
            message: "Verification code sent. Check your email.",
          });
        } catch (emailError) {
          return res.json({
            message: "Error sending verification code to your email",
            error: emailError.message,
          });
        }
      } else {
        return res.json({ message: "Email does not exist" });
      }
    });
});

app.post("/verifyOTP", (req, res) => {
  const email = req.body.email;
  const pin = req.body.otp;

  if (verificationPins[email]) {
    const pinData = verificationPins[email];
    const pinAge = Date.now() - pinData.createdAt;

    if (pinAge > PIN_EXPIRATION_TIME) {
      delete verificationPins[email];
      return res.json({
        message: "PIN has expired. Please request a new one.",
      });
    }

    if (pinData.pin === parseInt(pin)) {
      delete verificationPins[email];
      return res.json({ message: "Verified" });
    } else {
      return res.json({ message: "Incorrect PIN. Please try again." });
    }
  }

  return res.json({ message: "Incorrect PIN. Please try again." });
});

app.post("/resetPass", (req, res) => {
  const { email, confirmPass } = req.body;

  bcrypt.hash(confirmPass, 10, (err, hashedPassword) => {
    if (err) {
      return res.json({ message: "Error hashing password: " + err });
    }

    const updatePass = `UPDATE user SET Password = ? WHERE Email = ?`;
    const values = [hashedPassword, email];

    mysql.createConnection().query(updatePass, values, (err, userResult) => {
      if (err) {
        return res.json({ message: "Error in server: " + err });
      } else if (userResult.affectedRows > 0) {
        return res.json({ message: "Password reset successfully." });
      } else {
        return res.json({ message: "Failed to reset password" });
      }
    });
  });
});

mysql.createConnection = jest.fn().mockReturnValue({
  query: jest.fn().mockImplementation((query, values, callback) => {
    if (query.includes("SELECT * FROM user WHERE Email = ?")) {
      if (values === "existing@example.com") {
        callback(null, [{ Email: "existing@example.com" }]);
      } else {
        callback(null, []);
      }
    } else if (query.includes("UPDATE user SET Password = ? WHERE Email = ?")) {
      callback(null, { affectedRows: 1 });
    } else {
      callback(new Error("Unknown query"), null);
    }
  }),
});

nodemailer.createTransport = jest.fn().mockReturnValue({
  sendMail: jest.fn().mockResolvedValue(true),
});

describe("Forgot Password Functionality", () => {
  it("Should send OTP if the email exists", async () => {
    const response = await request(app)
      .post("/sendOTP")
      .send({ email: "existing@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Verification code sent. Check your email."
    );
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
  });

  it("Should return an error if the email does not exist", async () => {
    const response = await request(app)
      .post("/sendOTP")
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email does not exist");
  });

  it("Should verify OTP successfully if PIN is correct and not expired", async () => {
    const email = "existing@example.com";
    const pin = 123456;

    verificationPins[email] = { pin: pin, createdAt: Date.now() };

    const response = await request(app)
      .post("/verifyOTP")
      .send({ email, otp: pin.toString() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Verified");
  });

  it("Should return error if the PIN is incorrect", async () => {
    const response = await request(app)
      .post("/verifyOTP")
      .send({ email: "existing@example.com", otp: "111111" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Incorrect PIN. Please try again.");
  });

  it("Should return error if the PIN has expired", async () => {
    const email = "existing@example.com";
    const pin = 123456;

    verificationPins[email] = {
      pin: pin,
      createdAt: Date.now() - (PIN_EXPIRATION_TIME + 1000),
    };

    const response = await request(app)
      .post("/verifyOTP")
      .send({ email, otp: pin.toString() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "PIN has expired. Please request a new one."
    );
  });

  it("Should reset password successfully", async () => {
    const response = await request(app)
      .post("/resetPass")
      .send({ email: "existing@example.com", confirmPass: "newPassword123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password reset successfully.");
  });

  it("Should return error if reset password fails", async () => {
    mysql
      .createConnection()
      .query.mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 0 });
      });

    const response = await request(app)
      .post("/resetPass")
      .send({ email: "existing@example.com", confirmPass: "newPassword123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Failed to reset password");
  });

  it("Should return error if password hashing fails", async () => {
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce((password, salt, callback) => {
        callback(new Error("Hashing failed"));
      });

    const response = await request(app)
      .post("/resetPass")
      .send({ email: "existing@example.com", confirmPass: "newPassword123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Error hashing password: Error: Hashing failed"
    );
  });
});

module.exports = app;
