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

app.get("/getCourses", async (req, res) => {
  try {
    const response = await axios.get("/getCourses");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
});
app.post("/uploadContent", async (req, res) => {
  try {
    const response = await axios.post("/uploadContent", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error uploading content" });
  }
});

describe("Functionalities included in Add Content Page", () => {
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

  describe("For /getCourses", () => {
    it("Should fetch courses successfully", async () => {
      axios.get.mockResolvedValueOnce({
        data: { courses: ["Course1", "Course2"] },
      });

      const response = await request(app).get("/getCourses");
      expect(response.status).toBe(200);
      expect(response.body.courses).toEqual(["Course1", "Course2"]);
    });

    it("Should return error if unable to fetch courses", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error fetching courses"));

      const response = await request(app).get("/getCourses");
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error fetching courses");
    });
  });

  describe("For /uploadContent", () => {
    it("Should upload content successfully", async () => {
      axios.post.mockResolvedValueOnce({ data: { message: "Upload success" } });

      const response = await request(app)
        .post("/uploadContent")
        .send({ title: "Content 1" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Upload success");
    });

    it("Should return error if unable to upload content", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error uploading content"));

      const response = await request(app)
        .post("/uploadContent")
        .send({ title: "Content 1" });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error uploading content");
    });
  });
});

module.exports = app;
