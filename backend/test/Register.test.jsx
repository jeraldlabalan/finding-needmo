// PINAGHIWALAY KO I-TEST REGISTER AND LOG IN FUNCTION PARA MAS MADALI SA AKIN
const request = require("supertest");
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const db = {
  query: jest.fn(),
};

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

const app = express();
app.use(bodyParser.json());

let verificationPins = {};

app.post("/sendPIN", (req, res) => {
  const email = req.body.email;

  const emailQuery = `SELECT * FROM user WHERE Email = ?`;
  db.query(emailQuery, [email], (err, result) => {
    if (err) {
      return res.json({ message: "Error in server: " + err });
    } else if (result.length > 0) {
      return res.json({ message: "Email exists" });
    } else if (result.length === 0) {
      const randomPin = Math.floor(100000 + Math.random() * 900000);
      verificationPins[email] = { pin: randomPin, createdAt: Date.now() };

      const emailBody = `
        We received a request to register an account. Enter the code below to verify your identity.
        CODE: ${randomPin}
        If you didn't make the request, ignore this email.`;

      const mailOptions = {
        from: "virtualangel921@gmail.com",
        to: email,
        subject: "Sign Up Verification Code",
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
    }
  });
});

app.post("/verifyPin", (req, res) => {
  const email = req.body.email;
  const pin = req.body.pin;

  if (verificationPins[email]) {
    const pinData = verificationPins[email];
    const pinAge = Date.now() - pinData.createdAt;

    if (pinAge > 5 * 60 * 1000) {
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

  return res.json({ message: "PIN not found. Please request a new one." });
});

app.post("/submitSignUp", (req, res) => {
  const { email, confirmPass, accRole } = req.body;

  bcrypt.hash(confirmPass, 10, (err, hashedPassword) => {
    if (err) {
      return res.json({ message: "Error hashing password: " + err });
    }

    const sql = `INSERT INTO user (Email, Password, Role, Status) VALUES (?,?,?,?)`;
    const values = [email, hashedPassword, accRole, "Active"];

    db.query(sql, values, (err, userResult) => {
      if (err) {
        return res.json({ message: "Error in server: " + err });
      } else if (userResult.affectedRows > 0) {
        const userID = userResult.insertId;

        const profileQuery = `INSERT INTO profile (User, School) VALUES (?,?)`;
        const profileValues = [
          userID,
          "Cavite State University - Bacoor Campus",
        ];

        db.query(profileQuery, profileValues, (err, profileResult) => {
          if (err) {
            return res.json({
              message: "Error in server while creating profile: " + err,
            });
          } else if (profileResult.affectedRows > 0) {
            return res.json({
              message: "Sign up credentials and profile saved successfully",
            });
          } else {
            return res.json({ message: "Failed to create profile" });
          }
        });
      } else {
        return res.json({ message: "Failed to create an account" });
      }
    });
  });
});

describe("Unit Testing for Sign Up Function", () => {
  jest.useFakeTimers("modern").setSystemTime(new Date(2024, 0, 1, 12));

  describe("For '/sendPIN'", () => {
    it("Should return error if email exists", async () => {
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, [{ Email: "existing@example.com" }]);
      });

      const response = await request(app)
        .post("/sendPIN")
        .send({ email: "existing@example.com" });

      expect(response.body.message).toBe("Email exists");
    });

    it("Should send verification code if email does not exist", async () => {
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, []);
      });

      nodemailer.createTransport().sendMail.mockResolvedValueOnce({});

      const response = await request(app)
        .post("/sendPIN")
        .send({ email: "new@example.com" });

      expect(response.body.message).toBe(
        "Verification code sent. Check your email."
      );
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe("For '/verifyPin'", () => {
    it("Should return error if PIN has expired", async () => {
      const email = "test@example.com";
      verificationPins[email] = {
        pin: 123456,
        createdAt: Date.now() - 6 * 60 * 1000,
      };

      const response = await request(app)
        .post("/verifyPin")
        .send({ email, pin: 123456 });

      expect(response.body.message).toBe(
        "PIN has expired. Please request a new one."
      );
    });

    it("Should return success if PIN is correct", async () => {
      const email = "test@example.com";
      verificationPins[email] = { pin: 123456, createdAt: Date.now() };

      const response = await request(app)
        .post("/verifyPin")
        .send({ email, pin: 123456 });

      expect(response.body.message).toBe("Verified");
    });

    it("Should return error if PIN is incorrect", async () => {
      const email = "test@example.com";
      verificationPins[email] = { pin: 123456, createdAt: Date.now() };

      const response = await request(app)
        .post("/verifyPin")
        .send({ email, pin: 654321 });

      expect(response.body.message).toBe("Incorrect PIN. Please try again.");
    });

    it("Should return error if PIN not found", async () => {
      const response = await request(app)
        .post("/verifyPin")
        .send({ email: "nonexistent@example.com", pin: 123456 });

      expect(response.body.message).toBe(
        "PIN not found. Please request a new one."
      );
    });
  });

  describe("For '/submitSignUp'", () => {
    it("Should return error if password hashing fails", async () => {
      bcrypt.hash = jest
        .fn()
        .mockImplementation((pass, salt, cb) => cb(new Error("Hashing error")));

      const response = await request(app).post("/submitSignUp").send({
        email: "test@example.com",
        password: "password",
        confirmPass: "password",
        accRole: "Student",
      });

      expect(response.body.message).toBe(
        "Error hashing password: Error: Hashing error"
      );
    });

    it("Should submit user data and create profile successfully", async () => {
      bcrypt.hash = jest
        .fn()
        .mockImplementation((pass, salt, cb) => cb(null, "hashedPassword"));

      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, { affectedRows: 1, insertId: 1 });
      });

      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app).post("/submitSignUp").send({
        email: "test@example.com",
        password: "password",
        confirmPass: "password",
        accRole: "Student",
      });

      expect(response.body.message).toBe(
        "Sign up credentials and profile saved successfully"
      );
    });

    it("Should return error if sign up fails", async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(new Error("Database error"));
      });

      const response = await request(app).post("/submitSignUp").send({
        email: "test@example.com",
        password: "password",
        confirmPass: "password",
        accRole: "Student",
      });

      expect(response.body.message).toBe(
        "Error in server: Error: Database error"
      );
    });
  });
});

module.exports = app;
