const express = require("express");
const axios = require("axios");
const cors = require("cors");
const request = require("supertest");

jest.mock("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("/");
    if (response.data.valid) {
      res.json({
        valid: true,
        email: response.data.email,
        role: response.data.role,
      });
    } else {
      res.status(401).json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
});

app.get("/getProfile", async (req, res) => {
  try {
    const response = await axios.get("/getProfile");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

app.post("/saveStdProfileChanges", async (req, res) => {
  try {
    const response = await axios.post("/saveStdProfileChanges", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error saving profile changes" });
  }
});

describe("Functionalities included in Student Profile Page", () => {
  it("Should validate user session and set email and role", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true, email: "test@example.com", role: "Student" },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(true);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.role).toBe("Student");
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

  it("Should fetch user profile data successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        message: "User profile fetched successfully",
        pfp: "profile.jpg",
        userData: {},
        profileData: {},
      },
    });

    const response = await request(app).get("/getProfile");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User profile fetched successfully");
    expect(response.body.pfp).toBe("profile.jpg");
  });

  it("Should return error if unable to fetch profile", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching profile"));

    const response = await request(app).get("/getProfile");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching profile");
  });

  it("Should save profile changes successfully", async () => {
    const mockFormData = {
      uploadPFP: "image.jpg",
      pfpURL: "imageURL",
      firstName: "Jennie",
      lastName: "Kim",
      program: "Bachelor of Science in Computer Science",
    };

    axios.post.mockResolvedValueOnce({
      data: { message: "Changes saved", pfpURL: "image.jpg" },
    });

    const response = await request(app)
      .post("/saveStdProfileChanges")
      .send(mockFormData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Changes saved");
    expect(response.body.pfpURL).toBe("image.jpg");
  });

  it("Should return error if unable to save profile changes", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error saving profile changes"));

    const mockFormData = {
      uploadPFP: "image.jpg",
      pfpURL: "imageURL",
      firstName: "Jennie",
      lastName: "Kim",
      program: "Bachelor of Science in Computer Science",
    };

    const response = await request(app)
      .post("/saveStdProfileChanges")
      .send(mockFormData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error saving profile changes");
  });
});

module.exports = app;
