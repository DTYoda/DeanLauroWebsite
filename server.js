import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import path from "path";
import nodemailer from 'nodemailer';
import sqlite3 from 'sqlite3';
import https from "https";
import http from "http";
import fs from "fs";



const db = new sqlite3.Database('projects.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
});


const __dirname = dirname(fileURLToPath(import.meta.url));

var privateKey  = fs.readFileSync('cert/key.pem', 'utf8');
var certificate = fs.readFileSync('cert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/contact', (req, res) => {
    console.log("contact");
    res.sendFile(__dirname + "/views/contact.html");
});

app.post('/contact', (req, res) => {
    console.log("contact");
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
            pass: 'aee084df2ad00fe7e31e96b4f7d960b3',
        }
    });

    // Configure the mailoptions objects
    const mailOptions = {
        from: "contact@deanlauro.com",
        to: "DeanLauroBooking@gmail.com",
        subject: "Message from " + req.body.name + ": " + req.body.email,
        text: req.body.message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.log('Error:' + error);
            res.status(500).json("ERROR IN SENDING MESSAGE" + error);
        } else {
            console.log('Email sent: ' + info.response);
            SendNextEmail();
        }
    });

    const SendNextEmail = () => {

        const transporter2 = nodemailer.createTransport({
            host: 'live.smtp.mailtrap.io',
            port: 587,
            secure: false, // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: 'api',
                pass: 'aee084df2ad00fe7e31e96b4f7d960b3',
            }
        });
    
        // Configure the mailoptions object
        const mailOptions2 = {
            from: "contact@deanlauro.com",
            to: req.body.email,
            subject: "Thanks For Reaching Out!",
            text: "This email is confirming that your message has been receieved, and I will respond shortly! Thank you for reaching out, the message recieved was: " + req.body.message,
            template_uuid: "2a9f9e44-3b02-46e4-9f3f-5c98a36c941d",
            template_variables: {
                "name": "Test_Name",
                "message": req.body.message
            }
        };
    
        // Send the email
        transporter2.sendMail(mailOptions2, (error, info) =>{
            if (error) {
                console.log('Error:' + error);
                res.status(500).json("ERROR IN SENDING MESSAGE" + error);
            } else {
                console.log('Email sent: ' + info.response);
                return res.redirect("/contact");
            }
        });
    }
});

app.get('/portfolio', (req, res) => {
    db.all("SELECT * FROM projects", {}, (err, rows) => {
        if(!err && rows.length != 0)
        {
            res.render("portfolio.ejs", {projects: rows});
            return;
        }
        else
        {
            res.redirect("/");
            return;
        }
    });
});

app.get("/project", (req, res) => {
    db.get("SELECT * FROM projects WHERE name = $name;", {$name: req.query.name}, (err, row) => {
        if(!err && !(row == null))
        {
            res.render("project.ejs", {project: row});
            return;
        }
        else
        {
            res.redirect("/portfolio");
            return;
        }
    });
});

app.get("/create", (req, res) => {
    res.sendFile(__dirname + "/views/create.html");
});

app.post("/create", async (req, res) => {
    if(req.body.oldName)
    {
        let i = 0;
        for(let variable of Object.keys(req.body))
        {
            if(req.body[variable] != "" && variable != "oldName")
            {
                i++;
                db.run("UPDATE projects SET " + variable + " = $newValue WHERE name = $oldName;", {
                    $newValue: req.body[variable],
                    $oldName: req.body.oldName
                }, (err) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        
                    }
                });
            }
        }
        if (i == 0)
        {
            db.run("DELETE FROM projects WHERE name = $oldName;", {
                $oldName: req.body.oldName
            }, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    
                }
            });
        }
        return res.redirect("/create");
    }
    else if (req.body.name && req.body.description && req.body.link && req.body.type && req.body.date && req.body.image)
    {
        db.run("INSERT INTO projects (name, type, date, link, description, image) VALUES ($name, $type, $date, $link, $description, $image);", {
            $name: req.body.name,
            $type: req.body.type,
            $date: req.body.date,
            $link: req.body.link,
            $description: req.body.description,
            $image: req.body.image
        }, (err) => {
            if(err)
            {
                return res.status(500).send(err);
            }
            else
            {
                return res.redirect("/portfolio");
            }
        });
    }
    else 
    {
        return res.status(400).redirect("/portfolio");
    }
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);


