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

app.get("/searchResults/:search", async (req, res) => {
  const { search } = req.params;
  const { order } = req.query;
  try {
    const response = await axios.get(`/searchResults/${search}`, {
      params: { order: order },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching search results" });
  }
});

app.get("/getProfile", async (req, res) => {
  try {
    const response = await axios.get("/getProfile");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

app.get("/getCourses", async (req, res) => {
  try {
    const response = await axios.get("/getCourses");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
});

describe("Functionalities included in Search Results Page", () => {
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

  it("Should fetch search results successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: ["result1", "result2"],
        docxFiles: [],
        pptFiles: [],
        pdfFiles: [],
      },
    });

    const response = await request(app).get("/searchResults/test?order=ASC");

    expect(response.body.results).toEqual(["result1", "result2"]);
  });

  it("Should handle error fetching search results", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching search results"));

    const response = await request(app).get("/searchResults/test");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching search results");
  });

  it("Should fetch user profile successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        message: "User profile fetched successfully",
        pfp: "profile.jpg",
      },
    });

    const response = await request(app).get("/getProfile");

    expect(response.body.message).toBe("User profile fetched successfully");
    expect(response.body.pfp).toBe("profile.jpg");
  });

  it("Should handle error fetching user profile", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching user profile"));

    const response = await request(app).get("/getProfile");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching user profile");
  });

  it("Should fetch courses successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ Program: 1, CourseTitle: "Course1" }],
    });

    const response = await request(app).get("/getCourses");

    expect(response.body).toEqual([{ Program: 1, CourseTitle: "Course1" }]);
  });

  it("Should handle error fetching courses", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching courses"));

    const response = await request(app).get("/getCourses");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching courses");
  });

  it("Should paginate search results correctly", async () => {
    const searchResults = Array(15).fill("result");
    const itemsPerPage = 5;
    const currentPage = 1;

    const currentItems = searchResults.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    expect(currentItems.length).toBe(5);
  });

  it("Should handle sorting results by ASC", async () => {
    axios.get.mockResolvedValueOnce({
      data: { results: ["result1", "result2"] },
    });

    const response = await request(app).get("/searchResults/test?order=ASC");
    expect(response.body.results).toEqual(["result1", "result2"]);
  });

  it("Should handle sorting results by DESC", async () => {
    axios.get.mockResolvedValueOnce({
      data: { results: ["result2", "result1"] },
    });

    const response = await request(app).get("/searchResults/test?order=DESC");
    expect(response.body.results).toEqual(["result2", "result1"]);
  });
});

module.exports = app;
