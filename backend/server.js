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
import EducatorProfile from './routes/EducatorProfile.js';
import StudentProfile from './routes/StudentProfile.js';
import handleContent from './routes/handleContent.js';
import Search from './routes/Search.js';
import AccountSettings from './routes/AccountSettings.js';
import FileCreation from './routes/FileCreation.js';

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

app.use('/', EducatorProfile);
app.use('/', handleContent);
app.use('/', Search);
app.use('/', AccountSettings);
app.use('/', FileCreation);
app.use('/', StudentProfile);

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