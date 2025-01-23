const express = require("express");
const axios = require("axios");
const request = require("supertest");
const cors = require("cors");

jest.mock("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const sessionResponse = await axios.get("/");
    res.json(sessionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
});

app.get("/getProfile", async (req, res) => {
  try {
    const profileResponse = await axios.get("/getProfile");
    res.json(profileResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

app.post("/saveToSearchHistory", async (req, res) => {
  const { searchValue } = req.body;
  try {
    if (!searchValue) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const response = await axios.post("/saveToSearchHistory", {
      searchValue,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error saving search history" });
  }
});

describe("User Session, Profile Fetching, and Search Functionality.", () => {
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

  it("Should handle network error during session validation", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error during session validation");
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

    const response = await request(app).get("/getProfile");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching profile");
  });

  it("Should handle network error during profile fetching", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/getProfile");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching profile");
  });

  it("Should successfully save search history and return success", async () => {
    const searchValue = "React";
    axios.post.mockResolvedValueOnce({
      data: { message: "Success" },
    });

    const response = await request(app)
      .post("/saveToSearchHistory")
      .send({ searchValue });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should return an error when the search term is missing", async () => {
    const response = await request(app).post("/saveToSearchHistory").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Search term is required");
  });

  it("Should return an error when the search term is an empty string", async () => {
    const response = await request(app)
      .post("/saveToSearchHistory")
      .send({ searchValue: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Search term is required");
  });

  it("Should handle error while saving search history", async () => {
    const searchValue = "React";
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app)
      .post("/saveToSearchHistory")
      .send({ searchValue });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error saving search history");
  });

  it("Should return an error for incorrectly formatted request data", async () => {
    const response = await request(app)
      .post("/saveToSearchHistory")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("searchValue=React");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Search term is required");
  });
});

module.exports = app;
