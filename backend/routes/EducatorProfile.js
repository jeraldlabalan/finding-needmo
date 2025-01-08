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

router.get('/getEduContributions', (req, res) => {
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


router.post('/saveEducProfileChanges', upload.single("uploadPFP"), (req, res) => {
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
            return res.json({ message: "Changes saved", pfpURL: pfpPath });
        } else {
            console.log("failed", result);
            return res.json({ message: "Failed to save changes" });
        }
    })
})


router.get('/getProfile', (req, res) => {
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

export default router;