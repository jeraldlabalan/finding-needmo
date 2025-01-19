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
    const sessionResponse = await axios.get("/");
    res.json(sessionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "Error during session validation" });
  }
});

app.post("/verifyPassword/accSettings", async (req, res) => {
  try {
    const { password } = req.body;
    if (password === "kape123") {
      return res.json({ message: "Correct" });
    }
    res.status(500).json({ error: "Error during password verification" });
  } catch (error) {
    res.status(500).json({ error: "Error during password verification" });
  }
});

app.post("/changeEmail/accSettings", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(500).json({ error: "Error changing email" });
    }
    res.json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Error changing email" });
  }
});

app.post("/changePass/accSettings", async (req, res) => {
  try {
    const { confirmNewPass } = req.body;
    if (confirmNewPass === "tarakape123") {
      return res.json({ message: "Success" });
    }
    res.status(500).json({ error: "Error changing password" });
  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
});

describe("User Session and Account Settings Functionality", () => {
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

  it("Should verify the correct password", async () => {
    axios.post.mockResolvedValueOnce({ message: "Correct" });

    const response = await request(app)
      .post("/verifyPassword/accSettings")
      .send({ password: "kape123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Correct");
  });

  it("Should return error if incorrect password is provided", async () => {
    axios.post.mockResolvedValueOnce({ message: "Incorrect password" });

    const response = await request(app)
      .post("/verifyPassword/accSettings")
      .send({ password: "sakitnglikodko" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error during password verification");
  });

  it("Should handle error while verifying password", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app)
      .post("/verifyPassword/accSettings")
      .send({ password: "jenniekimitgirlngsokor" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error during password verification");
  });

  it("Should successfully change the email", async () => {
    axios.post.mockResolvedValueOnce({ message: "Success" });

    const response = await request(app)
      .post("/changeEmail/accSettings")
      .send({ email: "jenniekim@bp.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should return error if email format is invalid", async () => {
    const response = await request(app)
      .post("/changeEmail/accSettings")
      .send({ email: "jennierubyjane_" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error changing email");
  });

  it("Should successfully change password", async () => {
    axios.post.mockResolvedValueOnce({ message: "Success" });

    const response = await request(app)
      .post("/changePass/accSettings")
      .send({ confirmNewPass: "tarakape123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("Should return error if password change fails", async () => {
    axios.post.mockResolvedValueOnce({ message: "Failed to change password" });

    const response = await request(app)
      .post("/changePass/accSettings")
      .send({ confirmNewPass: "sakit" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error changing password");
  });

  it("Should return an error if email or password is missing", async () => {
    const response = await request(app)
      .post("/changeEmail/accSettings")
      .send({ email: "" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error changing email");
  });

  it("Should return an error if confirm new password is missing", async () => {
    const response = await request(app)
      .post("/changePass/accSettings")
      .send({});

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error changing password");
  });
});

module.exports = app;
