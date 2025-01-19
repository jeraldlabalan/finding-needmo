const request = require("supertest");
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const app = express();

jest.mock("mysql", () => ({
  createConnection: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

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

const cronJob = () => {
  const checkUsersSql = `
      SELECT COUNT(*) as inactiveCount
      FROM user
      WHERE Status = 'Active' AND DATEDIFF(NOW(), LastLoginAt) >= 30
  `;

  db.query(checkUsersSql, (err, countResult) => {
    if (err) {
      console.error("Error checking inactive users:", err);
    } else {
      const updateSql = `
          UPDATE user
          SET Status = 'Inactive'
          WHERE Status = 'Active' AND DATEDIFF(NOW(), LastLoginAt) >= 30
      `;

      db.query(updateSql, (err) => {
        if (err) {
          console.error("Error updating inactive users:", err);
        }
      });
    }
  });
};

describe("Log Out Functionality", () => {
  let server;

  beforeAll(() => {
    server = app.listen(3000);
    console.error = jest.fn();
  });

  afterAll(() => {
    server.close();
    console.error.mockRestore();
  });

  describe("Log Out", () => {
    it("Should log out the user successfully", async () => {
      const mockDbResponse = { affectedRows: 1 };
      db.query.mockImplementationOnce((query, values, callback) => {
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
      db.query.mockImplementationOnce((query, values, callback) => {
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
      db.query.mockImplementationOnce((query, values, callback) => {
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

  describe("Scheduled Task to Mark Users as Inactive", () => {
    it("Should run successfully and update inactive users", async () => {
      const mockDbResponse = [{ inactiveCount: 5 }];
      const mockUpdateResponse = { affectedRows: 5 };

      db.query.mockImplementationOnce((query, callback) => {
        if (query.includes("SELECT COUNT(*)")) {
          callback(null, mockDbResponse);
        }
      });

      db.query.mockImplementationOnce((query, callback) => {
        if (query.includes("UPDATE user")) {
          callback(null, mockUpdateResponse);
        }
      });

      await cronJob();

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT COUNT(*)"),
        expect.any(Function)
      );
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE user"),
        expect.any(Function)
      );
    });

    it("Should handle error in checking inactive users", async () => {
      const mockDbError = new Error("DB error");

      db.query.mockImplementationOnce((query, callback) => {
        callback(mockDbError, null);
      });

      await cronJob();

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT COUNT(*)"),
        expect.any(Function)
      );
    });

    it("Should handle error in updating inactive users", async () => {
      const mockDbResponse = [{ inactiveCount: 5 }];
      const mockUpdateError = new Error("Update failed");

      db.query.mockImplementationOnce((query, callback) => {
        if (query.includes("SELECT COUNT(*)")) {
          callback(null, mockDbResponse);
        }
      });

      db.query.mockImplementationOnce((query, callback) => {
        if (query.includes("UPDATE user")) {
          callback(mockUpdateError, null);
        }
      });

      await cronJob();

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE user"),
        expect.any(Function)
      );
    });
  });
});

module.exports = app;
