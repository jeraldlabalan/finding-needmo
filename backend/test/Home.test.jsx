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

describe("User Session and Search Functionality", () => {
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

  it("Should handle timeouts or slow networks during session validation", async () => {
    axios.get.mockRejectedValueOnce(new Error("Timeout"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error during session validation");
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
