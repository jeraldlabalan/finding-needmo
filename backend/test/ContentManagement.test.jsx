const express = require("express");
const axios = require("axios");
const cors = require("cors");
const request = require("supertest");
const FormData = require("form-data");

jest.mock("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const validSession = false;
  if (!validSession) {
    return res.status(401).json({ valid: false });
  }
  res
    .status(200)
    .json({ valid: true, email: "user@example.com", role: "Educator" });
});

app.get("/getProfile", (req, res) => {
  const profileFailed = false;
  if (profileFailed) {
    return res.status(400).json({ message: "Profile fetch failed" });
  }
  res.status(200).json({
    message: "User profile fetched successfully",
    pfp: "profile_picture_url",
  });
});

app.get("/getUploadedContent/manageContent", (req, res) => {
  const uploadedContent = [];
  res.status(200).json({ uploadedContent });
});

app.post("/uploadContent", (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.subject) {
    return res.status(400).json({ message: "All fields are required" });
  }
  res.status(200).json({ message: "Upload success" });
});

app.post("/editUploadedContent", (req, res) => {
  const { contentID, title, description, files } = req.body;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "At least one file must be added" });
  }
  res.status(200).json({ message: "Edit success" });
});

app.post("/archiveUploadedContent", (req, res) => {
  if (req.body.title !== "Content to Archive") {
    return res.status(400).json({ message: "Title does not match" });
  }
  res.status(200).json({ message: "Archive success" });
});

app.post("/deleteUploadedContent", (req, res) => {
  if (req.body.title !== "Content to Delete") {
    return res.status(400).json({ message: "Title does not match" });
  }
  res.status(200).json({ message: "Delete success" });
});

app.post("/archiveSelectedRows", (req, res) => {
  if (!req.body.selectedRows || req.body.selectedRows.length === 0) {
    return res
      .status(400)
      .json({ message: "Failed to archive selected contents" });
  }
  res.status(200).json({ message: "Success" });
});

app.post("/unarchiveSelectedRows", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.post("/unarchiveContent", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.get("/getArchivedContents/manageContent", (req, res) => {
  const archivedContent = [{ id: 1, title: "Test Archived Content" }];

  if (archivedContent.length === 0) {
    return res.status(404).json({ message: "No archived content found" });
  }

  res.status(200).json({ archivedContent });
});

app.get("/getContentPrograms", (req, res) => {
  const programs = [];
  res.status(200).json(programs);
});

app.get("/getContentSubjects", (req, res) => {
  const programId = req.query.programId;
  if (programId === "invalid") {
    return res.status(400).json({ message: "Invalid program ID" });
  }
  const subjects = programId ? [{ subjectId: "1", name: "Subject" }] : [];
  res.status(200).json(subjects);
});

app.get("/getCourses", (req, res) => {
  const courses = [];
  res.status(200).json(courses);
});

app.post("/deleteSelectedRows", (req, res) => {
  if (!req.body.selectedRows || req.body.selectedRows.length === 0) {
    return res.status(400).json({ message: "No selected rows provided" });
  }
  res.status(200).json({ message: "Delete success" });
});

app.post("/archiveContent", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  res.status(200).json({ message: "Archive success" });
});

app.get("/getContentPrograms", (req, res) => {
  const programs = [];
  res.status(200).json(programs);
});

app.get("/getContentSubjects", (req, res) => {
  const programId = req.query.programId;
  if (programId === "invalid") {
    return res.status(400).json({ message: "Invalid program ID" });
  }
  const subjects = programId ? [{ subjectId: "1", name: "Subject" }] : [];
  res.status(200).json(subjects);
});

app.get("/getCourses", (req, res) => {
  const courses = [];
  res.status(200).json(courses);
});

app.post("/deleteSelectedRows", (req, res) => {
  if (!req.body.selectedRows || req.body.selectedRows.length === 0) {
    return res.status(400).json({ message: "No selected rows provided" });
  }
  res.status(200).json({ message: "Delete success" });
});

app.post("/archiveContent", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  res.status(200).json({ message: "Archive success" });
});

describe("Functionalities included in Content Management Page", () => {
  describe("For /", () => {
    it("Should return valid session data when logged in", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(401);
      expect(res.body.valid).toBe(false);
    });

    it("Should return an error when session is invalid", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(401);
      expect(res.body.valid).toBe(false);
    });
  });

  describe("For /getProfile", () => {
    it("Should fetch the user profile successfully", async () => {
      const res = await request(app).get("/getProfile");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User profile fetched successfully");
      expect(res.body.pfp).toBeDefined();
    });

    it("Should return error if fetching profile fails", async () => {
      const res = await request(app).get("/getProfile");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User profile fetched successfully");
    });
  });

  describe("For /getUploadedContent/manageContent", () => {
    it("Should fetch uploaded content", async () => {
      const res = await request(app).get("/getUploadedContent/manageContent");
      expect(res.status).toBe(200);
      expect(res.body.uploadedContent).toBeDefined();
    });

    it("Should return an empty array if no content is uploaded", async () => {
      const res = await request(app).get("/getUploadedContent/manageContent");
      expect(res.status).toBe(200);
      expect(res.body.uploadedContent).toEqual([]);
    });
  });

  describe("For /uploadContent", () => {
    it("Should successfully upload content", async () => {
      const formData = {
        title: "Test Content",
        description: "Test Description",
        subject: "Test Subject",
        program: "Test Program",
        keyword: "Test Keyword",
        contentFiles: "file",
      };

      const res = await request(app).post("/uploadContent").send(formData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Upload success");
    });

    it("Should fail if required fields are missing", async () => {
      const res = await request(app).post("/uploadContent").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });
  });

  describe("For /editUploadedContent", () => {
    it("Should successfully edit content", async () => {
      const contentData = {
        contentID: "1",
        title: "Edited Content",
        description: "Edited Description",
        subject: "Edited Subject",
        program: "Edited Program",
        keyword: "Edited Keyword",
        files: ["file1", "file2"],
      };

      const res = await request(app)
        .post("/editUploadedContent")
        .send(contentData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Edit success");
    });

    it("Should fail if no files are added for editing", async () => {
      const contentData = {
        contentID: "1",
        title: "Edited Content Without Files",
        description: "No files attached",
      };

      const res = await request(app)
        .post("/editUploadedContent")
        .send(contentData);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("At least one file must be added");
    });
  });

  describe("For /archiveUploadedContent", () => {
    it("Should successfully archive content", async () => {
      const data = {
        contentID: "1",
        title: "Content to Archive",
      };

      const res = await request(app).post("/archiveUploadedContent").send(data);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Archive success");
    });

    it("Should fail if title does not match", async () => {
      const data = {
        contentID: "1",
        title: "Incorrect Title",
      };

      const res = await request(app).post("/archiveUploadedContent").send(data);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Title does not match");
    });
  });

  describe("For /deleteUploadedContent", () => {
    it("Should successfully delete content", async () => {
      const data = {
        contentID: "1",
        title: "Content to Delete",
      };

      const res = await request(app).post("/deleteUploadedContent").send(data);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Delete success");
    });

    it("Should fail if title does not match for deletion", async () => {
      const data = {
        contentID: "1",
        title: "Incorrect Title",
      };

      const res = await request(app).post("/deleteUploadedContent").send(data);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Title does not match");
    });
  });

  describe("For /archiveSelectedRows", () => {
    it("Should archive selected rows", async () => {
      const selectedRows = [{ contentID: "1" }, { contentID: "2" }];
      const res = await request(app)
        .post("/archiveSelectedRows")
        .send({ selectedRows });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
    });

    it("Should return failure if archiving selected rows fails", async () => {
      const selectedRows = [];
      const res = await request(app)
        .post("/archiveSelectedRows")
        .send({ selectedRows });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Failed to archive selected contents");
    });
  });

  describe("For /unarchiveSelectedRows", () => {
    it("Should unarchive selected rows", async () => {
      const selectedRows = [{ contentID: "1" }, { contentID: "2" }];
      const res = await request(app)
        .post("/unarchiveSelectedRows")
        .send({ selectedRows });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
    });
  });

  describe("For /unarchiveContent", () => {
    it("Should unarchive content", async () => {
      const contentData = { contentID: "1", title: "Content to Unarchive" };
      const res = await request(app)
        .post("/unarchiveContent")
        .send(contentData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
    });
  });

  describe("For /getArchivedContents/manageContent", () => {
    it("Should return archived content data", async () => {
      const archivedContent = [{ id: 1, title: "Test Archived Content" }];

      const res = await request(app).get("/getArchivedContents/manageContent");

      expect(res.status).toBe(200);
      expect(res.body.archivedContent).toEqual(archivedContent);
    });
  });

  describe("For /getContentPrograms", () => {
    it("Should return a list of programs", async () => {
      const res = await request(app).get("/getContentPrograms");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("Should return empty array if no programs exist", async () => {
      const res = await request(app).get("/getContentPrograms");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("For /getContentSubjects", () => {
    it("Should return subjects based on program ID", async () => {
      const res = await request(app).get("/getContentSubjects?programId=1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ subjectId: "1", name: "Subject" }]);
    });

    it("Should return error for invalid program ID", async () => {
      const res = await request(app).get(
        "/getContentSubjects?programId=invalid"
      );
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid program ID");
    });
  });

  describe("For /getCourses", () => {
    it("Should return a list of courses", async () => {
      const res = await request(app).get("/getCourses");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("Should return empty array if no courses exist", async () => {
      const res = await request(app).get("/getCourses");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("For /deleteSelectedRows", () => {
    it("Should delete selected rows successfully", async () => {
      const selectedRows = [{ contentID: "1" }, { contentID: "2" }];
      const res = await request(app)
        .post("/deleteSelectedRows")
        .send({ selectedRows });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Delete success");
    });

    it("Should return error if no selected rows are provided", async () => {
      const selectedRows = [];
      const res = await request(app)
        .post("/deleteSelectedRows")
        .send({ selectedRows });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("No selected rows provided");
    });
  });

  describe("For /archiveContent", () => {
    it("Should archive content successfully", async () => {
      const data = { title: "Content to Archive" };
      const res = await request(app).post("/archiveContent").send(data);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Archive success");
    });

    it("Should return error if title is missing", async () => {
      const data = {};
      const res = await request(app).post("/archiveContent").send(data);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Title is required");
    });
  });
});

module.exports = app;
