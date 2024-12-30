const request = require("supertest");
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "finding_needmo",
});

app.use(
  session({ secret: "test-secret", resave: false, saveUninitialized: true })
);
app.use(express.json());

app.post("/logout", (req, res) => {
  if (req.session) {
    const updatedStatus = `UPDATE user SET LastLoginAt = NOW(), Status = 'Active' WHERE Email = ?`;
    db.query(updatedStatus, req.session.email, (err, updateRes) => {
      if (err) {
        return res.json({ message: "Error in server: " + err });
      } else if (updateRes.affectedRows > 0) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res.json({ valid: false, message: "Logout failed." });
          }
          res.clearCookie("connect.sid");
          return res.json({ valid: false, message: "Logout successful." });
        });
      } else {
        return res.json({ valid: false, message: "Logout failed." });
      }
    });
  } else {
    return res.json({ valid: false, message: "No active session." });
  }
});

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

describe("Unit Testing for Log Out Function", () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll((done) => {
    server.close(done);
  });

  it("Should log out the user successfully", async () => {
    jest.setTimeout(10000);

    const mockSession = { email: "user@example.com" };
    const mockDbResponse = { affectedRows: 1 };

    mysql
      .createConnection()
      .query.mockImplementationOnce((query, values, callback) => {
        callback(null, mockDbResponse);
      });

    const response = await request(server)
      .post("/logout")
      .set("Cookie", ["connect.sid=some-session-id"])
      .send();

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.message).toBe("Logout successful.");
  });

  it("Should return error on server failure", async () => {
    jest.setTimeout(10000);

    mysql
      .createConnection()
      .query.mockImplementationOnce((query, values, callback) => {
        callback(new Error("DB error"), null);
      });

    const response = await request(server)
      .post("/logout")
      .set("Cookie", ["connect.sid=some-session-id"])
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Error in server: Error: DB error");
  });

  it("Should return error if update query affects no rows", async () => {
    jest.setTimeout(10000);

    mysql
      .createConnection()
      .query.mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 0 });
      });

    const response = await request(server)
      .post("/logout")
      .set("Cookie", ["connect.sid=some-session-id"])
      .send();

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
    expect(response.body.message).toBe("Logout failed.");
  });
});

module.exports = app;
