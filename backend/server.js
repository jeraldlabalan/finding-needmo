import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import nodemailer from 'nodemailer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finding_needmo'
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'virtualangel921@gmail.com', // Sender email
        pass: 'touz vsge xouk sgjr' // Sender App Password
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

app.use("/uploads", express.static("uploads"));

app.post('/deleteUploadedContent', (req, res) => {
    const { contentID, title } = req.body;

    console.log("Received Data for Archiving:", {
        contentID,
        title,
        userID: req.session.userID
    });

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
            console.log("Content archived successfully!");
            return res.json({ message: "Content deleted successfully!" });
        } else {
            console.log("Failed to archive content");
            return res.json({ message: "Failed to delete content" });
        }
    });
});

app.post('/archiveUploadedContent', (req, res) => {
    const { contentID, title } = req.body;

    console.log("Received Data for Archiving:", {
        contentID,
        title,
        userID: req.session.userID
    });

    const sql = `UPDATE content 
    SET UpdatedAt = NOW(), 
        IsArchived = 1 
    WHERE ContentID = ? AND CreatedBy = ?`;

    db.query(sql, [contentID, req.session.userID], (err, result) => {
        if (err) {
            console.error("Error archiving content:", err);
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0) {
            console.log("Content archived successfully!");
            return res.json({ message: "Content archived successfully!" });
        } else {
            console.log("Failed to archive content");
            return res.json({ message: "Failed to archive content" });
        }
    });
});

app.get('/getContentPrograms', (req, res) => {
    const sql = `SELECT ProgramID, Name FROM program`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        return res.json(result);
    })
})

app.get('/getContentSubjects', (req, res) => {
    const { program } = req.query;
    const sql = 'SELECT * FROM course WHERE Program = ?';
    db.query(sql, [program], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error: " + err });
      }
      res.json(result);
    });
})

app.post('/editUploadedContent', upload.array("editContentFiles"), (req, res) => {
    try {
        const { contentID, title, description, subject, program, keyword, existingFiles } = req.body;
        const files = req.files;

        console.log("Received Data:", {
            contentID,
            title,
            description,
            subject,
            program,
            keyword,
            files,
            existingFiles
        });

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
                console.log("Invalid CourseID:", subject);
                return res.status(400).json({ message: "Invalid CourseID" });
            }

            const existingFilesMetadata = existingFiles ? [JSON.parse(existingFiles)] : [];
            const newFilesMetadata = files.map(file => ({
                originalName: file.originalname,
                path: file.path,
                mimeType: file.mimetype,
                size: file.size
            }));

            const allFilesMetadata = [...existingFilesMetadata, ...newFilesMetadata];

            console.log("All Files Metadata:", allFilesMetadata);

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
                    req.session.userID
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

app.get('/getUploadedContent', (req, res) => {
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
                    console.log("Uploaded content:", result);
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


app.post("/uploadContent", upload.array("contentFiles"), (req, res) => {
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



app.get('/getCourses', (req, res) => {
    const sql = `SELECT * FROM course`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        return res.json(result);
    })
})

app.get('/getEduContributions', (req, res) => {
    const csCount = `SELECT COUNT(*) AS CSCount FROM content WHERE CreatedBy = ? AND IsArchived = ? AND isDeleted = ? AND Program = 1`;
    const itCount = `SELECT COUNT(*) AS ITCount FROM content WHERE CreatedBy = ? AND IsArchived = ? AND isDeleted = ? AND Program = 2`;

    const csValues = [
        req.session.userID,
        0,
        0
    ];

    const itValues = [
        req.session.userID,
        0,
        0
    ];

    db.query(csCount, csValues, (err, csRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        }

        db.query(itCount, itValues, (err, itRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            }

            res.json({
                message: "Contributions fetched",
                csCount: csRes[0].CSCount,
                itCount: itRes[0].ITCount
            })
        })
    })
})


app.post('/saveEducProfileChanges', upload.single("uploadPFP"), (req, res) => {
    const sql = `UPDATE profile
    SET Picture = ?,
        Firstname = ?,
        Lastname = ?,
        Position = ?,
        Program = ?
    WHERE User = ?
    `;

    const pfpPath = req.file ? req.file.path : req.body.pfpURL;

    const programValue = req.body.program || null;
    const values = [
        pfpPath,
        req.body.firstName,
        req.body.lastName,
        req.body.position,
        programValue,
        req.session.userID
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log("err", err);
            return res.json({ message: "Error in server: " + err });
        } else if (result.affectedRows > 0) {
            console.log("success", result);
            return res.json({ message: "Changes saved", pfpURL: pfpPath });
        } else {
            console.log("failed", result);
            return res.json({ message: "Failed to save changes" });
        }
    })
})


app.get('/getProfile', (req, res) => {
    const userQuery = `SELECT * FROM user WHERE Email = ?`;
    const profileQuery = `SELECT * FROM profile WHERE User = ?`;

    db.query(userQuery, req.session.email, (err, userRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (userRes.length > 0) {
            db.query(profileQuery, userRes[0].UserID, (err, profileRes) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (profileRes.length > 0) {
                    const pfp = `http://localhost:8080/${profileRes[0].Picture}`;

                    console.log(userRes);
                    console.log(profileRes);
                    return res.send({
                        message: "User profile fetched successfully",
                        pfp: pfp,
                        userData: userRes[0],
                        profileData: profileRes[0]
                    })
                } else {
                    return res.json({ message: "Error fetching user user profile" });
                }
            })
        } else {
            return res.json({ message: "Error fetching user login credentials" });
        }
    })
})

// Scheduled task to mark users as inactive without triggering anything in frontend
cron.schedule("0 0 * * *", () => {
    console.log("Running scheduled job to mark users as inactive...");

    const checkUsersSql = `
        SELECT COUNT(*) as inactiveCount
        FROM user
        WHERE Status = 'Active' AND DATEDIFF(NOW(), LastLoginAt) >= 30
    `;

    db.query(checkUsersSql, (err, countResult) => {
        if (err) {
            console.error("Error checking inactive users:", err);
        } else {
            console.log(`Number of users eligible for Inactive status: ${countResult[0].inactiveCount}`);

            const updateSql = `
                UPDATE user
                SET Status = 'Inactive'
                WHERE Status = 'Active' AND DATEDIFF(NOW(), LastLoginAt) >= 30
            `;

            db.query(updateSql, (err, result) => {
                if (err) {
                    console.error("Error updating inactive users:", err);
                } else {
                    console.log(`Updated ${result.affectedRows} user(s) to Inactive.`);
                }
            });
        }
    });
});


//LOGOUT
app.post("/logout", (req, res) => {
    if (req.session) {
        const updatedStatus = `UPDATE user SET LastLoginAt = NOW(), Status = 'Active' WHERE Email = ?`;
        db.query(updatedStatus, req.session.email, (err, updateRes) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (updateRes.affectedRows > 0) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return res.json({ valid: false, message: "Logout failed." });
                    }

                    res.clearCookie("connect.sid"); // Session cookie
                    return res.json({ valid: false, message: "Logout successful." });
                });
            }
        })
    } else {
        return res.json({ valid: false, message: "No active session." });
    }
});

//LOGIN
app.get('/', (req, res) => {
    if (req.session && req.session.userID) {
        return res.json({
            valid: true,
            userID: req.session.userID,
            role: req.session.role,
            email: req.session.email,
            firstname: req.session.firstname,
            lastname: req.session.lastname
        })
    } else {
        return res.json({ valid: false })
    }
})


app.post('/login', (req, res) => {
    const sql = `SELECT * FROM user WHERE Email = ?`;
    const { loginEmail, loginPass } = req.body;

    db.query(sql, [loginEmail], (err, result) => {
        if (err) return res.json({ message: "Error in server" + err });

        const user = result[0];
        if (result.length > 0) {
            // Compare the provided password with the hashed password in the database
            bcrypt.compare(loginPass, user.Password, (err, isMatch) => {
                if (err) {
                    return res.json({ message: "Error in password comparison" });
                }
                if (isMatch) {
                    if (user.Status === "Inactive") {
                        const updateStatus = `UPDATE user SET LastLoginAt = NOW(), Status = 'Active' WHERE Email = ?`;
                        db.query(updateStatus, user.Email, (err, updateStatusRes) => {
                            if (err) {
                                return res.json({ message: "Error in server" + err });
                            } else if (updateStatusRes.affectedRows > 0) {
                                const profileGetName = `SELECT * FROM profile WHERE User = ?`;
                                db.query(profileGetName, user.UserID, (err, getNameRes) => {
                                    if (err) {
                                        return res.json({ message: "Error in server: " } + err);
                                    } else if (getNameRes.length > 0) {
                                        const profile = getNameRes[0];

                                        req.session.userID = user.UserID;
                                        req.session.role = user.Role;
                                        req.session.email = user.Email;
                                        req.session.firstname = profile.Firstname;
                                        req.session.lastname = profile.Lastname;

                                        return res.json({
                                            message: 'Login successful',
                                            role: req.session.role,
                                            email: req.session.email,
                                            userID: req.session.userID,
                                            status: user.Status,
                                            firstname: req.session.firstname,
                                            lastname: req.session.lastname,
                                            isLoggedIn: true
                                        });
                                    } else {
                                        return res.json({ message: "Invalid credentials", isLoggedIn: false });
                                    }
                                });
                            }
                        });
                    } else if (user.Status === "Active") {
                        const profileGetName = `SELECT * FROM profile WHERE User = ?`;
                        db.query(profileGetName, user.UserID, (err, getNameRes) => {
                            if (err) {
                                return res.json({ message: "Error in server: " } + err);
                            } else if (getNameRes.length > 0) {
                                const profile = getNameRes[0];

                                req.session.userID = user.UserID;
                                req.session.role = user.Role;
                                req.session.email = user.Email;
                                req.session.firstname = profile.Firstname;
                                req.session.lastname = profile.Lastname;

                                return res.json({
                                    message: 'Login successful',
                                    role: req.session.role,
                                    email: req.session.email,
                                    userID: req.session.userID,
                                    status: user.Status,
                                    firstname: req.session.firstname,
                                    lastname: req.session.lastname,
                                    isLoggedIn: true
                                });
                            } else {
                                return res.json({ message: "Invalid credentials", isLoggedIn: false });
                            }
                        });
                    }
                } else {
                    return res.json({ message: "Incorrect password", isLoggedIn: false });
                }
            });
        } else {
            return res.json({ message: "Invalid credentials", isLoggedIn: false });
        }
    });
});

let verificationPins = {};

//FORGOT PASS
app.post('/sendOTP', (req, res) => {
    const email = req.body.email;
    const emailQuery = `SELECT * FROM user WHERE Email = ?`;
    db.query(emailQuery, req.body.email, (err, emailRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (emailRes.length > 0) {
            const randomPin = Math.floor(100000 + Math.random() * 900000);
            verificationPins[email] = { pin: randomPin, createdAt: Date.now() };

            const emailBody = `
            We received a request to reset the password for your account.

            CODE: ${randomPin}

            If you didn't make the request, ignore this email. Otherwise, you can reset your password.`;

            const mailOptions = {
                from: 'virtualangel921@gmail.com',
                to: email,
                subject: 'Password Reset Verification Code',
                text: emailBody,
            };

            try {
                transporter.sendMail(mailOptions);
                console.log(emailRes);
                console.log(emailBody);
                return res.json({ message: "Verification code sent. Check your email." });

            } catch (emailError) {
                return res.json({ message: "Error sending verification code to your email", error: emailError.message });
            }
        } else {
            return res.json({ message: "Email does not exist" });
        }
    })
})

app.post('/verifyOTP', (req, res) => {

    const email = req.body.email;
    const pin = req.body.otp;

    console.log(`PIN verification for email: ${email}, stored PIN: ${verificationPins[email]?.pin}`);

    // Check if PIN has expired
    if (verificationPins[email]) {
        const pinData = verificationPins[email];
        const pinAge = Date.now() - pinData.createdAt;

        if (pinAge > PIN_EXPIRATION_TIME) {
            delete verificationPins[email];
            return res.json({ message: "PIN has expired. Please request a new one." });
        }

        // If PIN is still valid, proceed to verify it
        if (pinData.pin === parseInt(pin)) {
            delete verificationPins[email]; // Successfully verified, remove the PIN
            return res.json({ message: "Verified" });
        } else {
            return res.json({ message: "Incorrect PIN. Please try again." });
        }
    }

    return res.json({ message: "PIN not found. Please request a new one." });
})

app.post('/resetPass', (req, res) => {
    const { email, confirmPass } = req.body;

    // Hash the password before storing it in the database
    bcrypt.hash(confirmPass, 10, (err, hashedPassword) => {
        if (err) {
            return res.json({ message: "Error hashing password: " + err });
        }

        // Insert into the user table with hashed password
        const updatePass = `UPDATE user SET Password = ? WHERE Email = ?`;
        const values = [
            hashedPassword,  // Store hashed password
            email
        ];

        db.query(updatePass, values, (err, userResult) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (userResult.affectedRows > 0) {
                return res.json({ message: "Password reset successfully." });
            } else {
                return res.json({ message: "Failed to reset password" });
            }
        });
    });
})

//SIGN UP
app.post('/sendPIN', (req, res) => {
    const email = req.body.email;

    const emailQuery = `SELECT * FROM user WHERE Email = ?`;
    db.query(emailQuery, [email], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " } + err);
        } else if (result.length > 0) {
            return res.json({ message: "Email exists" });
        } else if (result.length === 0) {
            const randomPin = Math.floor(100000 + Math.random() * 900000);
            verificationPins[email] = { pin: randomPin, createdAt: Date.now() };

            const emailBody = `
            We received a request to register an account. Enter the code below to verify your identity.

            CODE: ${randomPin}

            If you didn't make the request, ignore this email.`;

            const mailOptions = {
                from: 'virtualangel921@gmail.com',
                to: email,
                subject: 'Sign Up Verification Code',
                text: emailBody,
            };

            try {
                transporter.sendMail(mailOptions);
                console.log(result);
                console.log(emailBody);
                return res.json({ message: "Verification code sent. Check your email." });

            } catch (emailError) {
                return res.json({ message: "Error sending verification code to your email", error: emailError.message });
            }
        }
    })
})

const PIN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

setInterval(() => {
    for (let email in verificationPins) {
        const pinData = verificationPins[email];
        if (Date.now() - pinData.createdAt > PIN_EXPIRATION_TIME) {
            delete verificationPins[email];
            console.log(`Expired PIN for email: ${email}`);
        }
    }
}, 60 * 1000);

app.post('/verifyPin', (req, res) => {

    const email = req.body.email;
    const pin = req.body.pin;

    console.log(`PIN verification for email: ${email}, stored PIN: ${verificationPins[email]?.pin}`);

    // Check if PIN has expired
    if (verificationPins[email]) {
        const pinData = verificationPins[email];
        const pinAge = Date.now() - pinData.createdAt;

        if (pinAge > PIN_EXPIRATION_TIME) {
            delete verificationPins[email];
            return res.json({ message: "PIN has expired. Please request a new one." });
        }

        // If PIN is still valid, proceed to verify it
        if (pinData.pin === parseInt(pin)) {
            delete verificationPins[email]; // Successfully verified, remove the PIN
            return res.json({ message: "Verified" });
        } else {
            return res.json({ message: "Incorrect PIN. Please try again." });
        }
    }

    return res.json({ message: "PIN not found. Please request a new one." });
})


//STORE SIGN UP INFO IN DB
app.post('/submitSignUp', (req, res) => {
    const { email, confirmPass, accRole } = req.body;

    // Hash the password before storing it in the database
    bcrypt.hash(confirmPass, 10, (err, hashedPassword) => {
        if (err) {
            return res.json({ message: "Error hashing password: " + err });
        }

        // Insert into the user table with hashed password
        const sql = `INSERT INTO user (Email, Password, Role, Status) VALUES (?,?,?,?)`;
        const values = [
            email,
            hashedPassword,  // Store hashed password
            accRole,
            "Active",
        ];

        db.query(sql, values, (err, userResult) => {
            if (err) {
                return res.json({ message: "Error in server: " + err });
            } else if (userResult.affectedRows > 0) {
                const userID = userResult.insertId;
                console.log("Inserted userID:", userID);

                if (!userID) {
                    return res.json({ message: "UserID is null, cannot create profile" });
                }

                const profileQuery = `INSERT INTO profile (User, School) VALUES (?,?)`;
                const profileValues = [
                    userID,
                    "Cavite State University - Bacoor Campus"
                ];

                db.query(profileQuery, profileValues, (err, profileResult) => {
                    if (err) {
                        return res.json({ message: "Error in server while creating profile: " + err });
                    } else if (profileResult.affectedRows > 0) {
                        return res.json({ message: "Sign up credentials and profile saved successfully" });
                    } else {
                        return res.json({ message: "Failed to create profile" });
                    }
                });
            } else {
                return res.json({ message: "Failed to create an account" });
            }
        });
    });
});


app.listen(8080, () => {
    console.log(`Server is running`);
})