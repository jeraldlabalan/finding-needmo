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

app.get("/getUploadedContent", async (req, res) => {
  try {
    const response = await axios.get("/getUploadedContent");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching uploaded content" });
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

app.post("/editUploadedContent", async (req, res) => {
  try {
    const response = await axios.post("/editUploadedContent", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error editing content" });
  }
});

app.get("/getContentPrograms", async (req, res) => {
  try {
    const response = await axios.get("/getContentPrograms");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching content programs" });
  }
});

app.get("/getContentSubjects", async (req, res) => {
  try {
    const program = req.query.program;
    const response = await axios.get(`/getContentSubjects?program=${program}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching content subjects" });
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

app.get("/getEduContributions", async (req, res) => {
  try {
    const response = await axios.get("/getEduContributions");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching edu contributions" });
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

app.post("/saveEducProfileChanges", async (req, res) => {
  try {
    const response = await axios.post("/saveEducProfileChanges", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error saving profile changes" });
  }
});

app.post("/archiveUploadedContent", async (req, res) => {
  try {
    const response = await axios.post("/archiveUploadedContent", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error archiving content" });
  }
});

app.post("/deleteUploadedContent", async (req, res) => {
  try {
    const response = await axios.post("/deleteUploadedContent", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error deleting content" });
  }
});

describe("Functionalities included in Profile Page", () => {
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

  describe("For /getUploadedContent", () => {
    it("Should fetch uploaded content successfully", async () => {
      axios.get.mockResolvedValueOnce({
        data: { uploadedContent: ["content1", "content2"] },
      });

      const response = await request(app).get("/getUploadedContent");
      expect(response.status).toBe(200);
      expect(response.body.uploadedContent).toEqual(["content1", "content2"]);
    });

    it("Should return error if unable to fetch uploaded content", async () => {
      axios.get.mockRejectedValueOnce(new Error("Error fetching content"));

      const response = await request(app).get("/getUploadedContent");
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error fetching uploaded content");
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

  describe("For /editUploadedContent", () => {
    it("Should edit content successfully", async () => {
      axios.post.mockResolvedValueOnce({ data: { message: "Edit success" } });

      const response = await request(app)
        .post("/editUploadedContent")
        .send({ contentID: 1, title: "Updated Content" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Edit success");
    });

    it("Should return error if unable to edit content", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error editing content"));

      const response = await request(app)
        .post("/editUploadedContent")
        .send({ contentID: 1, title: "Updated Content" });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error editing content");
    });
  });

  describe("For /getContentPrograms", () => {
    it("Should fetch content programs successfully", async () => {
      axios.get.mockResolvedValueOnce({
        data: { programs: ["Program1", "Program2"] },
      });

      const response = await request(app).get("/getContentPrograms");
      expect(response.status).toBe(200);
      expect(response.body.programs).toEqual(["Program1", "Program2"]);
    });

    it("Should return error if unable to fetch content programs", async () => {
      axios.get.mockRejectedValueOnce(
        new Error("Error fetching content programs")
      );

      const response = await request(app).get("/getContentPrograms");
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error fetching content programs");
    });
  });

  describe("For /getContentSubjects", () => {
    it("Should fetch content subjects successfully", async () => {
      axios.get.mockResolvedValueOnce({
        data: { subjects: ["Subject1", "Subject2"] },
      });

      const response = await request(app).get("/getContentSubjects?program=1");
      expect(response.status).toBe(200);
      expect(response.body.subjects).toEqual(["Subject1", "Subject2"]);
    });

    it("Should return error if unable to fetch content subjects", async () => {
      axios.get.mockRejectedValueOnce(
        new Error("Error fetching content subjects")
      );

      const response = await request(app).get("/getContentSubjects?program=1");
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error fetching content subjects");
    });
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

  describe("For /getEduContributions", () => {
    it("Should fetch edu contributions successfully", async () => {
      axios.get.mockResolvedValueOnce({ data: { csCount: 10, itCount: 5 } });

      const response = await request(app).get("/getEduContributions");
      expect(response.status).toBe(200);
      expect(response.body.csCount).toBe(10);
      expect(response.body.itCount).toBe(5);
    });

    it("Should return error if unable to fetch edu contributions", async () => {
      axios.get.mockRejectedValueOnce(
        new Error("Error fetching edu contributions")
      );

      const response = await request(app).get("/getEduContributions");
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error fetching edu contributions");
    });
  });

  describe("For /getProfile", () => {
    it("Should fetch profile successfully", async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          message: "User profile fetched successfully",
          pfp: "profile.jpg",
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
  });

  describe("For /saveEducProfileChanges", () => {
    it("Should save profile changes successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Profile saved successfully" },
      });

      const response = await request(app)
        .post("/saveEducProfileChanges")
        .send({ firstName: "Jennie" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profile saved successfully");
    });

    it("Should return error if unable to save profile changes", async () => {
      axios.post.mockRejectedValueOnce(
        new Error("Error saving profile changes")
      );

      const response = await request(app)
        .post("/saveEducProfileChanges")
        .send({ firstName: "Jennie" });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error saving profile changes");
    });
  });

  describe("For /archiveUploadedContent", () => {
    it("Should archive content successfully", async () => {
      axios.post.mockResolvedValueOnce({
        data: { message: "Archive success" },
      });

      const response = await request(app)
        .post("/archiveUploadedContent")
        .send({ contentID: 1 });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Archive success");
    });

    it("Should return error if unable to archive content", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error archiving content"));

      const response = await request(app)
        .post("/archiveUploadedContent")
        .send({ contentID: 1 });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error archiving content");
    });
  });

  describe("For /deleteUploadedContent", () => {
    it("Should delete content successfully", async () => {
      axios.post.mockResolvedValueOnce({ data: { message: "Delete success" } });

      const response = await request(app)
        .post("/deleteUploadedContent")
        .send({ contentID: 1 });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Delete success");
    });

    it("Should return error if unable to delete content", async () => {
      axios.post.mockRejectedValueOnce(new Error("Error deleting content"));

      const response = await request(app)
        .post("/deleteUploadedContent")
        .send({ contentID: 1 });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error deleting content");
    });
  });
});

module.exports = app;
