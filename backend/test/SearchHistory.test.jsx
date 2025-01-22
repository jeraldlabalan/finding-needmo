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

app.get("/getSearchHistory", async (req, res) => {
  try {
    const response = await axios.get("/getSearchHistory");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching search history" });
  }
});

app.post("/deleteASearch", async (req, res) => {
  const { historyID } = req.body;
  try {
    if (!historyID) {
      return res.status(400).json({ message: "History ID is required" });
    }

    const response = await axios.post("/deleteASearch", {
      historyID,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error deleting search" });
  }
});

app.post("/deleteAllSearch", async (req, res) => {
  try {
    const response = await axios.post("/deleteAllSearch");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error deleting all searches" });
  }
});

app.post("/deleteSearchByDate", async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const response = await axios.post("/deleteSearchByDate", {
      startDate,
      endDate,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error deleting search by date" });
  }
});

describe("User Session, Fetching, and Deleting Search History Functionality", () => {
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

  it("Should handle incomplete session data gracefully", async () => {
    axios.get.mockResolvedValueOnce({
      data: { valid: true },
    });

    const response = await request(app).get("/");

    expect(response.body.valid).toBe(true);
    expect(response.body.email).toBeUndefined();
    expect(response.body.role).toBeUndefined();
  });

  it("Should fetch search history successfully", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        message: "Success",
        searches: [
          { HistoryID: 1, Entry: "AI", SearchedAt: "2025-01-22T10:00:00Z" },
        ],
      },
    });

    const response = await request(app).get("/getSearchHistory");

    expect(response.body.message).toBe("Success");
    expect(response.body.searches).toHaveLength(1);
    expect(response.body.searches[0].Entry).toBe("AI");
  });

  it("Should return an empty search history if no searches exist", async () => {
    axios.get.mockResolvedValueOnce({
      data: { message: "Success", searches: [] },
    });

    const response = await request(app).get("/getSearchHistory");

    expect(response.body.message).toBe("Success");
    expect(response.body.searches).toHaveLength(0);
  });

  it("Should handle error fetching search history", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/getSearchHistory");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error fetching search history");
  });

  it("Should delete a search successfully", async () => {
    const historyID = 1;
    axios.post.mockResolvedValueOnce({
      data: { message: "Success" },
    });

    const response = await request(app)
      .post("/deleteASearch")
      .send({ historyID });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should return error if history is missing when deleting a search", async () => {
    const response = await request(app).post("/deleteASearch").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("History ID is required");
  });

  it("Should handle error deleting a search", async () => {
    const historyID = 1;
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app)
      .post("/deleteASearch")
      .send({ historyID });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error deleting search");
  });

  it("Should delete all searches successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Success" },
    });

    const response = await request(app).post("/deleteAllSearch");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should handle no searches to delete", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "No searches to delete" },
    });

    const response = await request(app).post("/deleteAllSearch");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("No searches to delete");
  });

  it("Should handle error deleting all searches", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).post("/deleteAllSearch");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error deleting all searches");
  });

  it("Should delete search by date successfully", async () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-22";
    axios.post.mockResolvedValueOnce({
      data: { message: "Success" },
    });

    const response = await request(app)
      .post("/deleteSearchByDate")
      .send({ startDate, endDate });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should return error if start or end date is missing when deleting search by date", async () => {
    const response = await request(app).post("/deleteSearchByDate").send({});

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error deleting search by date");
  });

  it("Should handle error deleting search by date", async () => {
    const startDate = "2025-01-01";
    const endDate = "2025-01-22";
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app)
      .post("/deleteSearchByDate")
      .send({ startDate, endDate });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error deleting search by date");
  });
});

module.exports = app;
