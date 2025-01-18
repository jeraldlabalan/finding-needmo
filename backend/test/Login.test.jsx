const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");

jest.mock("mysql");
jest.mock("bcryptjs");

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: "test-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/login", (req, res) => {
  const { loginEmail, loginPass } = req.body;

  if (!loginEmail || !loginPass) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const connection = mysql.createConnection();
  connection.query(
    "SELECT * FROM user WHERE Email = ?",
    [loginEmail],
    (err, userResults) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (!userResults || userResults.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = userResults[0];
      bcrypt.compare(loginPass, user.Password, (err, isMatch) => {
        if (err)
          return res.status(500).json({ message: "Error comparing passwords" });

        if (!isMatch) {
          return res.status(400).json({ message: "Incorrect password" });
        }

        const updateStatusSql =
          user.Status === "Inactive"
            ? 'UPDATE user SET Status = "Active", LastLoginAt = NOW() WHERE UserID = ?'
            : "SELECT * FROM profile WHERE User = ?";

        connection.query(
          updateStatusSql,
          [user.UserID],
          (err, updateResult) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Error updating user status" });

            connection.query(
              "SELECT * FROM profile WHERE User = ?",
              [user.UserID],
              (err, profileResults) => {
                if (err)
                  return res.status(500).json({ message: "Database error" });

                const profile = profileResults[0];
                req.session.userID = user.UserID;
                res.status(200).json({
                  message: "Login successful",
                  isLoggedIn: true,
                  userID: user.UserID,
                  firstname: profile.Firstname,
                  lastname: profile.Lastname,
                  status: user.Status === "Inactive" ? "Active" : user.Status,
                });
              }
            );
          }
        );
      });
    }
  );
});

app.get("/", (req, res) => {
  if (req.session.userID) {
    const userID = req.session.userID;
    const connection = mysql.createConnection();
    connection.query(
      "SELECT * FROM user WHERE UserID = ?",
      [userID],
      (err, userResults) => {
        if (err) return res.status(500).json({ message: "Database error" });

        const user = userResults[0];
        connection.query(
          "SELECT * FROM profile WHERE User = ?",
          [userID],
          (err, profileResults) => {
            if (err) return res.status(500).json({ message: "Database error" });

            const profile = profileResults[0];
            res.status(200).json({
              valid: true,
              userID: user.UserID,
              firstname: profile.Firstname,
              lastname: profile.Lastname,
            });
          }
        );
      }
    );
  } else {
    res.status(200).json({ valid: false });
  }
});

describe("Log In Functionality", () => {
  let mockQuery;

  beforeAll(() => {
    mockQuery = jest.fn();
    mysql.createConnection = jest.fn().mockReturnValue({
      query: mockQuery,
      end: jest.fn(),
    });
  });

  it("Should log in the user and return user info if credentials are correct and status is active", async () => {
    const user = {
      UserID: 1,
      Email: "test@example.com",
      Password: "hashedpassword",
      Status: "Active",
      Role: "Student",
    };
    const profile = {
      User: 1,
      Firstname: "Jennie",
      Lastname: "Kim",
    };

    mockQuery.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM user")) {
        callback(null, [user]);
      } else if (sql.includes("SELECT * FROM profile")) {
        callback(null, [profile]);
      }
    });

    bcrypt.compare.mockImplementation((password, hash, callback) => {
      callback(null, true);
    });

    const response = await request(app).post("/login").send({
      loginEmail: "test@example.com",
      loginPass: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.isLoggedIn).toBe(true);
    expect(response.body.userID).toBe(user.UserID);
    expect(response.body.firstname).toBe(profile.Firstname);
    expect(response.body.lastname).toBe(profile.Lastname);
  });

  it("Should return error when incorrect password is provided", async () => {
    const user = {
      UserID: 1,
      Email: "test@example.com",
      Password: "hashedpassword",
      Status: "Active",
    };

    mockQuery.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM user")) {
        callback(null, [user]);
      }
    });

    bcrypt.compare.mockImplementation((password, hash, callback) => {
      callback(null, false);
    });

    const response = await request(app).post("/login").send({
      loginEmail: "test@example.com",
      loginPass: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Incorrect password");
  });

  it("Should return error if the user is not found", async () => {
    mockQuery.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM user")) {
        callback(null, []);
      }
    });

    const response = await request(app).post("/login").send({
      loginEmail: "nonexistent@example.com",
      loginPass: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  it("Should return error for missing login email", async () => {
    const response = await request(app).post("/login").send({
      loginPass: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing email or password");
  });

  it("Should return error for missing login password", async () => {
    const response = await request(app).post("/login").send({
      loginEmail: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing email or password");
  });

  it("Should return database error if there's an issue querying user", async () => {
    mockQuery.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).post("/login").send({
      loginEmail: "test@example.com",
      loginPass: "password",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database error");
  });

  it("Should return user info if user is logged in", async () => {
    const user = {
      UserID: 1,
      Email: "test@example.com",
      Password: "hashedpassword",
      Status: "Active",
      Role: "Student",
    };
    const profile = {
      User: 1,
      Firstname: "Jennie",
      Lastname: "Kim",
    };

    mockQuery.mockImplementation((sql, params, callback) => {
      if (sql.includes("SELECT * FROM user")) {
        callback(null, [user]);
      } else if (sql.includes("SELECT * FROM profile")) {
        callback(null, [profile]);
      }
    });

    bcrypt.compare.mockImplementation((password, hash, callback) => {
      callback(null, true);
    });

    const loginResponse = await request(app).post("/login").send({
      loginEmail: "test@example.com",
      loginPass: "password",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.isLoggedIn).toBe(true);

    const response = await request(app)
      .get("/")
      .set("Cookie", loginResponse.headers["set-cookie"]);

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.userID).toBe(user.UserID);
    expect(response.body.firstname).toBe(profile.Firstname);
    expect(response.body.lastname).toBe(profile.Lastname);
  });

  it("Should return valid false if user is not logged in", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
  });
});

module.exports = app;
