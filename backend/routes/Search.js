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

router.post('/deleteSearchByDate', (req, res) => {
    const { startDate, endDate } = req.body;
  
    const getID = `SELECT * FROM user WHERE Email = ?`;
    db.query(getID, req.session.email, (err, idRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            const id = idRes[0].UserID;

            // Convert startDate and endDate to 'YYYY-MM-DD' format (ignoring time)
            const formattedStartDate = new Date(startDate).toISOString().split('T')[0]; 
            const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
        
            const query = `
            DELETE FROM searchhistory
            WHERE DATE(SearchedAt) >= ? AND DATE(SearchedAt) <= ?
            AND SearchedBy = ?`;

            db.query(query, [formattedStartDate, formattedEndDate, id], (err, deleteRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(deleteRes.affectedRows > 0){
                    return res.json({message: "Success"});
                } else {
                    return res.json({message: "Failed"});
                }
            })
        }
    })
});

router.post('/deleteASearch', (req, res) => {
    const { historyID } = req.body;
    const getID = `SELECT * FROM user WHERE Email = ?`;
    db.query(getID, req.session.email, (err, idRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            const deleteSearch = `DELETE FROM searchhistory WHERE HistoryID = ? AND SearchedBy = ?`;
            db.query(deleteSearch, [historyID, idRes[0].UserID], (err, deleteRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else if(deleteRes.affectedRows > 0){
                    return res.json({message: "Success"});
                } else{
                    return res.json({message: "Failed"});
                }
            })
        }
    })
})

router.get('/getSearchHistory', (req,res) => {
    const getID = `SELECT * FROM user WHERE Email = ?`;
    db.query(getID, req.session.email, (err, idRes) => {
        if(err){
            return res.json({message: "Error in server: " + err});
        } else {
            const getSearch = `SELECT * FROM searchhistory WHERE SearchedBy = ?`;
            db.query(getSearch, idRes[0].UserID, (err, searchRes) => {
                if(err){
                    return res.json({message: "Error in server: " + err});
                } else {
                    return res.json({message: "Success", searches: searchRes});
                }
            })
        }
    })
})

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
        JOIN profile ON content.CreatedBy = profile.User
        JOIN course ON content.Course = course.CourseID
        WHERE 
            content.Title LIKE ? OR 
            content.Description LIKE ? OR 
            content.Tags LIKE ?
        ORDER BY content.UploadedAt DESC
    `;

    const searchKeyword = `%${search}%`;

    db.query(searchQuery, [searchKeyword, searchKeyword, searchKeyword], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server:" + err });
        } else {
            // Separate the files by extension for each content entry
            const docxFiles = [];
            const pptFiles = [];
            const pdfFiles = [];
            console.log("Contents: ", result);  // Log the content result for debugging
    
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
                    console.log("Files for item", item.ContentID, files);  // Log files for each content item
                    
                    // Create separate arrays for docx, ppt, and pdf files for each content item
                    const itemDocxFiles = [];
                    const itemPptFiles = [];
                    const itemPdfFiles = [];
    
                    files.forEach(file => {
                        // Ensure we have a valid file object
                        if (file) {
                            // Derive extension if it's missing
                            const fileExtension = file.extension 
                                ? file.extension.toLowerCase() 
                                : file.originalName.split('.').pop().toLowerCase();
                    
                            // Log the file and its derived extension
                            console.log(`Processing file: ${file.originalName}, Derived Extension: ${fileExtension}`);
                    
                            // Filter files by extension
                            if (fileExtension === 'docx') {
                                itemDocxFiles.push(file);
                            } else if (fileExtension === 'ppt') {
                                itemPptFiles.push(file);
                            } else if (fileExtension === 'pdf') {
                                itemPdfFiles.push(file);
                            }
                        } else {
                            console.warn("Invalid file object:", file);
                        }
                    });
                        
                    
    
                    // Attach the separated files to the result item for later display in frontend
                    item.docxFiles = itemDocxFiles;
                    item.pptFiles = itemPptFiles;
                    item.pdfFiles = itemPdfFiles;
    
                    // Log the separated files for each content item
                    console.log("DOCX Files for item", item.ContentID, itemDocxFiles);
                    console.log("PPT Files for item", item.ContentID, itemPptFiles);
                    console.log("PDF Files for item", item.ContentID, itemPdfFiles);

                    // Push the content item with its separated files into their respective arrays
                    if (itemDocxFiles.length > 0) docxFiles.push(item);
                    if (itemPptFiles.length > 0) pptFiles.push(item);
                    if (itemPdfFiles.length > 0) pdfFiles.push(item);  // Make sure to push the entire content item with its PDFs
                });
            }
    
            console.log("PDFS: ", pdfFiles);  // Log the pdfFiles array to check if it includes multiple content items
    
            // Return both the full content with separated files and the individual file arrays
            res.json({
                results: result,   // Full content result with separated files attached
                docxFiles,         // DOCX files only, from all content
                pptFiles,          // PPT files only, from all content
                pdfFiles           // PDF files only, from all content
            });
        }
    });
});



export default router;