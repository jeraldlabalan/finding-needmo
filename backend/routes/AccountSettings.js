import express from 'express';
import mysql from 'mysql';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';

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

router.post('/changePass/accSettings', (req, res) => {
    const { confirmNewPass } = req.body;

    bcrypt.hash(confirmNewPass, 10, (err, hashedPassword) => {
            if (err) {
                return res.json({ message: "Error hashing password: " + err });
            }
    
            // Insert into the user table with hashed password
            const update =`
            UPDATE user
            SET Password = ?,
                UpdatedAt = NOW()
            WHERE Email = ?`;
            const values = [
                hashedPassword,  // Store hashed password
                req.session.email
            ];
    
            db.query(update, values, (err, userResult) => {
                if (err) {
                    return res.json({ message: "Error in server: " + err });
                } else if (userResult.affectedRows > 0) {
                    return res.json({ message: "Success" });
                } else {
                    return res.json({ message: "Failed" });
                }
            });
        });
})

router.post('/changeEmail/accSettings', (req, res) => {
    const { email } = req.body;

    const update = `UPDATE user
                    SET Email = ?,
                        UpdatedAt = NOW()
                    WHERE Email = ?`;

    db.query(update, [email, req.session.email], (err, updateRes) => {
        if (err) {
            return res.json({ message: "Error in server: " + err });
        } else if (updateRes.affectedRows > 0) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session:", err);
                    return res.json({ message: "Logout failed" });
                }

                res.clearCookie("connect.sid");
                return res.json({ message: "Success", logout: true });
            });
        } else {
            return res.json({ message: "Failed" });
        }
    });
});



router.post('/verifyPassword/accSettings', (req, res) => {
    const {password} = req.body;
    const user = `SELECT * FROM user WHERE Email = ?`;

    db.query(user, req.session.email, (err, userRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            bcrypt.compare(password, userRes[0].Password, (err, isMatch) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(isMatch){
                    return res.json({message: "Correct"});
                } else {
                    return res.json({message: "Wrong"});
                }
            })            
        }
    })
})

export default router;