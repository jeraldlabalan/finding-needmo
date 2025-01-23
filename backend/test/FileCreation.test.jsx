const express = require("express");
const axios = require("axios");
const cors = require("cors");
const request = require("supertest");

jest.mock("axios");

const app = express();
app.use(cors());
app.use(express.json());

const validateSession = async (req, res, next) => {
  try {
    const sessionResponse = await axios.get("/");
    if (
      sessionResponse.data.valid &&
      sessionResponse.data.role === "Educator"
    ) {
      next();
    } else {
      res.status(403).json({ error: "Access denied. Educator role required." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
};

app.get("/", async (req, res) => {
  try {
    const sessionResponse = await axios.get("/");
    res.json(sessionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
});

describe("User Session Validation to access File Editor", () => {
  it("Should validate user session and set email and role", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, email: "test@example.com", role: "Educator" },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(true);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.role).toBe("Educator");
  });

  it("Should return error if session is not valid", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: false },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(false);
  });

  it("Should handle error while validating session", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error during session validation");
  });

  it("Should handle unexpected or incomplete session data gracefully", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(true);
    expect(response.body.email).toBeUndefined();
    expect(response.body.role).toBeUndefined();
  });
});

module.exports = app;
