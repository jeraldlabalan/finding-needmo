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