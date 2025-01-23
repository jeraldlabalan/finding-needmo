import express from 'express';
import mysql from 'mysql';
import multer from 'multer';
import path from 'path';

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

router.get("/viewContentDetails/:contentID", (req, res) => {
    const { contentID } = req.params;

    const searchQuery = `
    SELECT content.*, profile.Firstname, profile.Lastname, profile.Picture, course.Title AS CourseTitle
    FROM content
    JOIN profile ON content.CreatedBy = profile.User
    JOIN course ON content.Course = course.CourseID
    WHERE content.ContentID = ?
    `;

    db.query(searchQuery, contentID, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server:" + err });
        } else {
            // Separate the files by extension for each content entry
            const docxFiles = [];
            const pptFiles = [];
            const pdfFiles = [];
            const videoFiles = [];
            const audioFiles = [];
    
            // Check if result has multiple content entries
            if (result && result.length > 0) {
                // Iterate over each content result
                result.forEach(item => {
                    // Parse the Files column into an array of file objects
                    let files = [];
                    try {
                        files = JSON.parse(item.Files);
                    } catch (err) {
                        console.error("Error parsing files for ContentID", item.ContentID, err);
                    }
                    
                    // Create separate arrays for docx, ppt, and pdf files for each content item
                    const itemDocxFiles = [];
                    const itemPptFiles = [];
                    const itemPdfFiles = [];
                    const itemVideoFiles = [];
                    const itemAudioFiles = [];
    
                    files.forEach(file => {
                        // Ensure we have a valid file object
                        if (file) {
                            // Derive extension if it's missing
                            const fileExtension = file.extension 
                                ? file.extension.toLowerCase() 
                                : file.originalName.split('.').pop().toLowerCase();
                    
                            // Log the file and its derived extension
                    
                            // Filter files by extension
                            if (fileExtension === 'docx') {
                                itemDocxFiles.push(file);
                            } else if (fileExtension === 'pptx') {
                                itemPptFiles.push(file);
                            } else if (fileExtension === 'pdf') {
                                itemPdfFiles.push(file);
                            } else if (fileExtension === 'mp4') {
                                itemVideoFiles.push(file);
                            } else if (fileExtension === 'mp3') {
                                itemAudioFiles.push(file);
                            }
                        } else {
                            console.warn("Invalid file object:", file);
                        }
                    });
                        
                    
                    // Attach the separated files to the result item for later display in frontend
                    item.docxFiles = itemDocxFiles;
                    item.pptFiles = itemPptFiles;
                    item.pdfFiles = itemPdfFiles;
                    item.videoFiles = itemVideoFiles;
                    item.audioFiles = itemAudioFiles;
    

                    // Push the content item with its separated files into their respective arrays
                    if (itemDocxFiles.length > 0) docxFiles.push(item);
                    if (itemPptFiles.length > 0) pptFiles.push(item);
                    if (itemPdfFiles.length > 0) pdfFiles.push(item); 
                    if (itemVideoFiles.length > 0) videoFiles.push(item); 
                    if (itemAudioFiles.length > 0) audioFiles.push(item); 
                });
            }
    
    
            // Return both the full content with separated files and the individual file arrays
            res.json({
                results: result[0],   // Full content result with separated files attached
                docxFiles,         // DOCX files only, from all content
                pptFiles,          // PPT files only, from all content
                pdfFiles,           // PDF files only, from all content
                videoFiles,
                audioFiles
            });
        }
    });
});

export default router;