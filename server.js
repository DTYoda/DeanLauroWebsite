import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import path from "path";
import nodemailer from 'nodemailer';


const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/contact', (req, res) => {
    console.log("Get");
    res.sendFile(__dirname + "/views/contact.html");
});

app.post('/contact', (req, res) => {
    if(!req.body.name || !req.body.email || !req.body.message)
    {
        return res.status(400).redirect('/contact');
    }

    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        secure: false, // use false for STARTTLS; true for SSL on port 465
        auth: {
        user: 'api',
        pass: '55506db695be910fb89e27b2bfc1159c',
        }
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: "hkaras1121@demomailtrap.com",
        to: "DeanLauroBooking@gmail.com",
        subject: "Message from " + req.body.name + ": " + req.body.email,
        text: req.body.message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.log('Error:' + error);
            res.status(500).redirect("/contact");
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).redirect("/contact");
        }
    });
});

app.get('/portfolio', (req, res) => {
    res.sendFile(__dirname + "/views/portfolio.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});