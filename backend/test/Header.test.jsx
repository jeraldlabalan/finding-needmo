const express = require("express");
const axios = require("axios");
const request = require("supertest");
const cors = require("cors");

jest.mock("axios");

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const sessionResponse = await axios.get("mocked-session-url");
    res.json(sessionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
});

app.get("/getProfile", async (req, res) => {
  try {
    const profileResponse = await axios.get("mocked-profile-url");
    res.json(profileResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

describe("User Session and Profile Fetching", () => {
  it("Should validate user session and set email and role", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, email: "test@example.com", role: "student" },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(true);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.role).toBe("student");
  });

  it("Should return error if session is not valid", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: false },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(false);
  });

  it("Should successfully fetch user profile", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        message: "User profile fetched successfully",
        pfp: "jennie.jpg",
      },
    });

    const response = await request(app).get("/getProfile");

    expect(response.body.message).toBe("User profile fetched successfully");
    expect(response.body.pfp).toBe("jennie.jpg");
  });

  it("Should handle error while fetching profile", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching profile"));

    try {
      await request(app).get("/getProfile");
    } catch (err) {
      expect(err.message).toBe("Error fetching profile");
    }
  });

  it("Should handle network error during session validation", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    try {
      await request(app).get("/");
    } catch (err) {
      expect(err.message).toBe("Network Error");
    }
  });

  it("Should handle network error during profile fetching", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    try {
      await request(app).get("/getProfile");
    } catch (err) {
      expect(err.message).toBe("Network Error");
    }
  });
});

module.exports = app;
