import express from 'express';
import mysql from 'mysql';
import fs from "fs";

const router = express.Router();

// Create a database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finding_needmo'
})

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    }
});


router.post("/save", (req, res) => {
    const fileData = req.body; // Capture file data from ONLYOFFICE
    const filePath = "./saved-doc.docx";
  
    // Save the file
    fs.writeFile(filePath, fileData, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.status(500).send("Error saving file");
      }
      res.send("File saved successfully");
    });
  });

export default router;