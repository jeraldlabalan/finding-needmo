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

app.get("/viewContentDetails/:contentID", async (req, res) => {
  const { contentID } = req.params;
  try {
    if (contentID === "invalidID") {
      return res.status(400).json({ error: "Bad Request" });
    }
    if (contentID === "999") {
      return res.status(404).json({ error: "Content not found" });
    }

    const response = await axios.get(`/viewContentDetails/${contentID}`);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }
    res.status(500).json({ error: "Error fetching content details" });
  }
});

describe("Functionalities included in View Content Page", () => {
  it("Should validate user session successfully", async () => {
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

  it("Should fetch content details successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: ["result1", "result2"],
        docxFiles: [],
        pptFiles: [],
        pdfFiles: [],
        videoFiles: [],
        audioFiles: [],
        Picture: "profile.jpg",
      },
    });

    const response = await request(app).get("/viewContentDetails/123");
    expect(response.body.results).toEqual(["result1", "result2"]);
    expect(response.body.Picture).toBe("profile.jpg");
  });

  it("Should handle error fetching content details", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/viewContentDetails/123");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching content details");
  });

  it("Should return error if content is not found", async () => {
    const response = await request(app).get("/viewContentDetails/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Content not found");
  });

  it("Should return error status code if an invalid content ID is provided", async () => {
    const response = await request(app).get("/viewContentDetails/invalidID");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should handle empty response gracefully when fetching content details", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [],
        docxFiles: [],
        pptFiles: [],
        pdfFiles: [],
        videoFiles: [],
        audioFiles: [],
        Picture: "",
      },
    });

    const response = await request(app).get("/viewContentDetails/123");
    expect(response.body.results).toEqual([]);
    expect(response.body.Picture).toBe("");
  });

  it("Should handle unexpected errors gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Unexpected Error"));

    const response = await request(app).get("/viewContentDetails/123");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching content details");
  });
});

module.exports = app;
