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

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
    },
});

const upload = multer({ storage });

router.use("/uploads", express.static("uploads"));

router.post('/deleteSelectedRows', (req, res) => {
    const { selectedCards } = req.body;
    const rows = selectedCards.map(() => '?').join(',');
    const query = `UPDATE content
                   SET IsDeleted = 1
                   WHERE ContentID IN (${rows})
                   AND CreatedBy = ?`;

    const params = [...selectedCards, req.session.userID];                   
    db.query(query, params, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0){
            return res.json({message: "Success"});
        } else{
            return res.json({message: "Failed"});
        }
    })
})


router.post('/unarchiveSelectedRows', (req, res) => {
    const { selectedCards } = req.body;
    const rows = selectedCards.map(() => '?').join(',');
    const query = `UPDATE content
                   SET IsArchived = 0
                   WHERE ContentID IN (${rows})
                   AND CreatedBy = ?`;

    const params = [...selectedCards, req.session.userID];                   
    db.query(query, params, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0){
            return res.json({message: "Success"});
        } else{
            return res.json({message: "Failed"});
        }
    })
})


router.post('/archiveSelectedRows', (req, res) => {
    const { selectedCards } = req.body;
    const rows = selectedCards.map(() => '?').join(',');
    const query = `UPDATE content
                   SET IsArchived = 1
                   WHERE ContentID IN (${rows})
                   AND CreatedBy = ?`;

    const params = [...selectedCards, req.session.userID];                   
    db.query(query, params, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0){
            return res.json({message: "Success"});
        } else{
            return res.json({message: "Failed"});
        }
    })
})


router.post('/unarchiveContent', (req, res) => {
    const user = `SELECT * FROM user WHERE Email = ?`;
    const { contentID, title } = req.body;
    const archive = `
    UPDATE content
    SET UpdatedAt = NOW(),
        isArchived = 0
    WHERE CreatedBy = ? AND ContentID = ?`;

    db.query(user, req.session.email, (err, userRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else {
            db.query(archive, [userRes[0].UserID, contentID], (err, updateRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if(updateRes.affectedRows > 0){
                    return res.json({message: `Success`});
                } else {
                    return res.json({message: `Failed`});
                }
            })
        }
    })
})


router.get('/getArchivedContents/manageContent', (req, res) => {
    const sql = `
        SELECT * 
        FROM content 
        WHERE CreatedBy = ? AND IsArchived = ? AND IsDeleted = ? 
        ORDER BY UploadedAt DESC
    `;
    
    // Query for the content
    db.query(sql, [req.session.userID, 1, 0], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            // Get the course IDs from the content result
            const courseIds = result.map(item => item.Course);

            // Create placeholders for the course IDs
            const placeholders = courseIds.map(() => '?').join(', ');
            const getCourseTitle = `SELECT * FROM course WHERE CourseID IN (${placeholders})`;

            // Query for the courses
            db.query(getCourseTitle, courseIds, (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (courseRes.length > 0) {
                    // Add the course titles to the result
                    result.forEach(content => {
                        const course = courseRes.find(c => c.CourseID === content.Course);
                        if (course) {
                            content.CourseTitle = course.Title; // Add course title to the content object
                        }
                    });

                    // Parse the Files JSON data before sending to frontend
                    result.forEach(item => {
                        item.Files = item.Files ? JSON.parse(item.Files) : [];  // Ensure Files is in a proper object format
                      });

                    // Send back the data including course titles
                    
                    return res.json({ archivedRes: result });
                } else {
                    return res.json({ message: "No course titles found." });
                }
            });
        } else {
            return res.json({ message: "No archived content found." });
        }
    });
});


router.get('/getArchivedContents', (req, res) => {
    const sql = `
        SELECT * 
        FROM content 
        WHERE CreatedBy = ? AND IsArchived = ? AND IsDeleted = ? 
        ORDER BY UploadedAt DESC
        LIMIT 3
    `;
    
    // Query for the content
    db.query(sql, [req.session.userID, 1, 0], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            // Get the course IDs from the content result
            const courseIds = result.map(item => item.Course);

            // Create placeholders for the course IDs
            const placeholders = courseIds.map(() => '?').join(', ');
            const getCourseTitle = `SELECT * FROM course WHERE CourseID IN (${placeholders})`;

            // Query for the courses
            db.query(getCourseTitle, courseIds, (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (courseRes.length > 0) {
                    // Add the course titles to the result
                    result.forEach(content => {
                        const course = courseRes.find(c => c.CourseID === content.Course);
                        if (course) {
                            content.CourseTitle = course.Title; // Add course title to the content object
                        }
                    });

                    // Parse the Files JSON data before sending to frontend
                    result.forEach(item => {
                        item.Files = item.Files ? JSON.parse(item.Files) : [];  // Ensure Files is in a proper object format
                      });

                    // Send back the data including course titles
                    
                    return res.json({ archivedRes: result });
                } else {
                    return res.json({ message: "No course titles found." });
                }
            });
        } else {
            return res.json({ message: "No archived content found." });
        }
    });
});


router.post('/deleteUploadedContent', (req, res) => {
    const { contentID, title } = req.body;

    const sql = `UPDATE content 
    SET UpdatedAt = NOW(), 
        IsDeleted = 1,
        DeletedAt = NOW()
    WHERE ContentID = ? AND CreatedBy = ?`;

    db.query(sql, [contentID, req.session.userID], (err, result) => {
        if (err) {
            console.error("Error deleting content:", err);
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0) {
            return res.json({ message: "Content deleted successfully!" });
        } else {
            return res.json({ message: "Failed to delete content" });
        }
    });
});

router.post('/archiveUploadedContent', (req, res) => {
    const { contentID, title } = req.body;

    const sql = `UPDATE content 
    SET UpdatedAt = NOW(), 
        IsArchived = 1 
    WHERE ContentID = ? AND CreatedBy = ?`;

    db.query(sql, [contentID, req.session.userID], (err, result) => {
        if (err) {
            console.error("Error archiving content:", err);
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0) {
            return res.json({ message: "Content archived successfully!" });
        } else {
            return res.json({ message: "Failed to archive content" });
        }
    });
});

router.get('/getContentPrograms', (req, res) => {
    const sql = `SELECT ProgramID, Name FROM program`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        return res.json(result);
    })
})

router.get('/getContentSubjects', (req, res) => {
    const { program } = req.query;
    const sql = 'SELECT * FROM course WHERE Program = ?';
    db.query(sql, [program], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error: " + err });
      }
      res.json(result);
    });
})

router.post('/editUploadedContent', upload.array("editContentFiles"), (req, res) => {
    try {
        const { contentID, title, description, subject, program, keyword, existingFiles } = req.body;
        const files = req.files;
    
    
        if (!contentID || !title || !description || !subject || !program || !keyword) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        // Check if the subject (CourseID) exists in the course table
        const checkCourseSql = 'SELECT * FROM course WHERE CourseID = ?';
        db.query(checkCourseSql, [subject], (err, courseResult) => {
            if (err) {
                console.error("Error checking course:", err);
                return res.status(500).json({ message: "Database error: " + err });
            }
    
            if (courseResult.length === 0) {
                return res.status(400).json({ message: "Invalid CourseID" });
            }
    
            // Parse existing files
            const existingFilesMetadata = existingFiles
                ? existingFiles.map((file) => JSON.parse(file))
                : [];
            const newFilesMetadata = files.map((file) => ({
                originalName: file.originalname,
                path: file.path,
                mimeType: file.mimetype,
                size: file.size,
            }));
    
            const allFilesMetadata = [...existingFilesMetadata, ...newFilesMetadata];
            const datetimeUpload = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
            const sql = `
                UPDATE content
                SET Title = ?,
                    Description = ?,
                    Course = ?,
                    Program = ?,
                    Files = ?,
                    Tags = ?,
                    UploadedAt = ?,
                    UpdatedAt = NOW()
                WHERE ContentID = ? AND CreatedBy = ?
            `;
    
            db.query(
                sql,
                [
                    title,
                    description,
                    subject,
                    program,
                    JSON.stringify(allFilesMetadata), // Save metadata as JSON
                    keyword,
                    datetimeUpload,
                    contentID,
                    req.session.userID,
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error saving content:", err);
                        return res.status(500).json({ message: "Database error: " + err });
                    }
    
                    res.json({
                        message: "Content edited successfully!",
                        contentId: contentID,
                    });
                }
            );
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "Unexpected error occurred" });
    }
    
});

router.get('/getUploadedContent/manageContent', (req, res) => {
    const sql = `
        SELECT * 
        FROM content 
        WHERE CreatedBy = ? AND IsArchived = ? AND IsDeleted = ? 
        ORDER BY UploadedAt DESC
    `;
    
    // Query for the content
    db.query(sql, [req.session.userID, 0, 0], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            // Get the course IDs from the content result
            const courseIds = result.map(item => item.Course);

            // Create placeholders for the course IDs
            const placeholders = courseIds.map(() => '?').join(', ');
            const getCourseTitle = `SELECT * FROM course WHERE CourseID IN (${placeholders})`;

            // Query for the courses
            db.query(getCourseTitle, courseIds, (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (courseRes.length > 0) {
                    // Add the course titles to the result
                    result.forEach(content => {
                        const course = courseRes.find(c => c.CourseID === content.Course);
                        if (course) {
                            content.CourseTitle = course.Title; // Add course title to the content object
                        }
                    });

                    // Parse the Files JSON data before sending to frontend
                    result.forEach(item => {
                        item.Files = item.Files ? JSON.parse(item.Files) : [];  // Ensure Files is in a proper object format
                      });

                    // Send back the data including course titles
                    
                    return res.json({ uploadedContent: result });
                } else {
                    return res.json({ message: "No course titles found." });
                }
            });
        } else {
            return res.json({ message: "No uploaded content found." });
        }
    });
});

router.get('/getUploadedContent', (req, res) => {
    const sql = `
        SELECT * 
        FROM content 
        WHERE CreatedBy = ? AND IsArchived = ? AND IsDeleted = ? 
        ORDER BY UploadedAt DESC
        LIMIT 3
    `;
    
    // Query for the content
    db.query(sql, [req.session.userID, 0, 0], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (result.length > 0) {
            // Get the course IDs from the content result
            const courseIds = result.map(item => item.Course);

            // Create placeholders for the course IDs
            const placeholders = courseIds.map(() => '?').join(', ');
            const getCourseTitle = `SELECT * FROM course WHERE CourseID IN (${placeholders})`;

            // Query for the courses
            db.query(getCourseTitle, courseIds, (err, courseRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (courseRes.length > 0) {
                    // Add the course titles to the result
                    result.forEach(content => {
                        const course = courseRes.find(c => c.CourseID === content.Course);
                        if (course) {
                            content.CourseTitle = course.Title; // Add course title to the content object
                        }
                    });

                    // Parse the Files JSON data before sending to frontend
                    result.forEach(item => {
                        item.Files = item.Files ? JSON.parse(item.Files) : [];  // Ensure Files is in a proper object format
                      });

                    // Send back the data including course titles
                    
                    return res.json({ uploadedContent: result });
                } else {
                    return res.json({ message: "No course titles found." });
                }
            });
        } else {
            return res.json({ message: "No uploaded content found." });
        }
    });
});


router.post("/uploadContent", upload.array("contentFiles"), (req, res) => {
    const { title, description, subject, program, keyword } = req.body;

    // Map uploaded files to include metadata
    const filesMetadata = req.files.map((file) => {
        const fileExtension = file.originalname.split('.').pop(); // Extract extension
        return {
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            extension: fileExtension, // Add extension
        };
    });

    const totalFileSize = filesMetadata.reduce((acc, file) => acc + file.size, 0);

    // Extract all file extensions as a comma-separated string or JSON array
    const fileFormats = filesMetadata.map((file) => file.extension).join(','); // e.g., "pptx,mp4,docx"

    // Get current datetime
    const datetimeUpload = new Date();

    // Save to database
    const sql = `INSERT INTO content (CreatedBy, Program, Title, Description, Course, Files, Format, FileSize, Tags, UploadedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
        sql,
        [
            req.session.userID,
            program,
            title,
            description,
            subject,
            JSON.stringify(filesMetadata), // Save metadata as JSON
            fileFormats, // Store file extensions
            totalFileSize, // Total size of all files
            keyword,
            datetimeUpload,
        ],
        (err, result) => {
            if (err) {
                console.error("Error saving content:", err);
                return res.json({ message: "Database error: " + err });
            }

            res.json({
                message: "Content uploaded successfully!",
                contentId: result.insertId,
                totalFileSize,
                fileFormats,
            });
        }
    );
});



router.get('/getCourses', (req, res) => {
    const sql = `SELECT * FROM course`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        return res.json(result);
    })
})

export default router;