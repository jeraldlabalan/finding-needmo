import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(cors());

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

let verificationPins = {};

app.post('/sendPIN', (req, res) => {
    const email = req.body.email;

    const emailQuery = `SELECT * FROM user WHERE Email = ?`;
    db.query(emailQuery, [email], (err, result) => {
        if (err) {
            return res.json({ message: "Error in server: " } + err);
        } else if(result.length > 0){
            return res.json({ message: "Email exists" });
        } else if (result.length === 0){
            const randomPin = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
            verificationPins[email] = randomPin;

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
                return res.json({ message: "Verification code sent. Check your email." });
            } catch (emailError) {
                return res.json({ message: "Error sending verification code to your email", error: emailError.message });
            }
        }
    })
})

app.listen(8080, () => {
    console.log(`Server is running`);
})