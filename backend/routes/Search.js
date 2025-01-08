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

router.post('/saveToSearchHistory', (req, res) => {
    const { searchValue } = req.body;

    const user = `SELECT * FROM user WHERE Email = ?`;
    const insertQuery = `INSERT INTO searchhistory (SearchedBy, Entry) VALUES (?, ?)`;

    db.query(user, req.session.email, (err, userRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            db.query(insertQuery, [userRes[0].UserID, searchValue], (err, insertRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(insertRes.affectedRows > 0){
                    return res.json({message: "Success"});
                } else{
                    return res.json({message: "Error saving your search to search history"});
                }
            })
        }
    })
})

router.get("/searchResults/:search", (req, res) => {
    const { search } = req.params;
    const searchQuery = `
    SELECT content.*, profile.Firstname, profile.Lastname, course.Title AS CourseTitle
        FROM content
        JOIN profile ON content.createdBy = profile.User
        JOIN course ON content.Course = course.CourseID
        WHERE 
            content.Title LIKE ? OR 
            content.Description LIKE ? OR 
            content.Tags LIKE ?
        ORDER BY content.Title ASC
    `;

    const searchKeyword = `%${search}%`;

    db.query(searchQuery, [searchKeyword, searchKeyword, searchKeyword], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server:" + err });
        } else {
            return res.json({ results: result });
        }
    });
});

export default router;