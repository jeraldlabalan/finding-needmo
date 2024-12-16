import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import nodemailer from 'nodemailer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

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

//LOGOUT
app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.json({ valid: false, message: "Logout failed." });
            }
            res.clearCookie("connect.sid"); // Session cookie
            return res.json({ valid: false, message: "Logout successful." });
        });
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
    const sql = `SELECT * FROM user WHERE Email = ? AND Password = ?`;
    const { loginEmail, loginPass } = req.body;

    db.query(sql, [loginEmail, loginPass], (err, result) => {
        if (err) return res.json({ message: "Error in server" + err });

        const user = result[0];
        if (result.length > 0) {
            if (user.Status === "Deactivated") {
                return res.json({ message: "Account is no longer active.", isLoggedIn: false });
            } else if (user.Status === "Suspended") {
                return res.json({ message: "Account is suspended", isLoggedIn: false });
            } else if (user.Status === "Active") {
                const profileGetName = `SELECT * FROM profile WHERE UserID = ?`;
                db.query(profileGetName, user.UserID, (err, getNameRes) => {
                    if (err) {
                        return res.json({ message: "Error in server: " } + err);
                    } else if (getNameRes.length > 0) {
                        const profile = getNameRes[0];

                        req.session.userID = user.UserID;
                        req.session.role = user.UserType;
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
                        return res.json({ message: "Invalid credentials", isLoggedIn: false })
                    }
                })
            }

        } else {
            return res.json({ message: "Invalid credentials", isLoggedIn: false })
        }
    });
});

let verificationPins = {};

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

const PIN_EXPIRATION_TIME = 1 * 60 * 1000; // 5 minutes in milliseconds

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

// Function to format time to 24-hour format for MySQL
const getCurrentDatetime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');  // 'YYYY-MM-DD HH:mm:ss'
};

//STORE SIGN UP INFO IN DB
app.post('/submitSignUp', (req, res) => {
    const datetime = getCurrentDatetime();

    // Insert into the user table
    const sql = `INSERT INTO user (Email, Password, UserType, CreatedAt, Status) VALUES (?,?,?,?,?)`;
    const values = [
        req.body.email,
        req.body.confirmPass,
        req.body.accRole,
        datetime,
        "Active",
    ];

    db.query(sql, values, (err, userResult) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (userResult.affectedRows > 0) {
            // Get the userID from the insert result
            const userID = userResult.insertId;
            console.log("Inserted userID:", userID);  // Log userID to confirm

            // Check if userID is valid
            if (!userID) {
                return res.json({ message: "UserID is null, cannot create profile" });
            }

            // Now insert into the profile table using the userID
            const profileQuery = `INSERT INTO profile (UserID, SchoolName) VALUES (?,?)`;
            const profileValues = [
                userID,  // Use the inserted userID
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


app.post('/registerToProfile', (req, res) => {
    const getID = `SELECT * FROM user WHERE Email = ?`;
    db.query(getID, req.body.email, (err, idRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (idRes.length > 0) {
            const profileQuery = `INSERT INTO profile (UserID, SchoolName) VALUES (?,?)`;
            const profileValues = [
                idRes[0].userID,
                "Cavite State University - Bacoor Campus"
            ];

            db.query(profileQuery, profileValues, (err, profileResult) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (profileResult.affectedRows > 0) {
                    return res.json({ message: "Sign up credentials saved successfully" });
                } else {
                    return res.json({ message: "Failed to create an account" });
                }
            })
        }
    })
})

app.listen(8080, () => {
    console.log(`Server is running`);
})