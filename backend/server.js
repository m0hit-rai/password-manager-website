const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const credentials = require('./mongo-password');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const uri = `mongodb+srv://${credentials.username}:${credentials.pass}@pass-manage.6z6kk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let collection;
client.connect().then(() => {
    collection = client.db("password-manage").collection("user-credentials");
}).catch((err) => console.log(err));

// middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000", // react location
    credentials: true
}))

app.use(session({
    secret: "v3ryL0ngRand0mS3cretK3y",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("v3ryL0ngRand0mS3cretK3y"));

// routes
app.post('/login', async (req, res) => {
    collection.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) {
            res.status(500).send("Some error occured!");
            throw err;
        }
        else if (!doc) {
            res.status(404).send("Username not found!");
        }
        else {
            bcrypt.compare(doc.password, req.body.password, (err, result) => {
                if (err) {
                    res.status(500).send("Some error occured!");
                    throw err;
                }
                else if (result === false)
                    res.status(401).send("Wrong Password");
                else
                    res.send("User Logged in");
            });
        }
    });
});


app.post('/register', async (req, res) => {

    collection.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) {
            res.status(500).send("Some error occured!");
            throw err;
        }
        else if (doc) {
            res.status(400).send("Username already exists");
        }
        else {
            const protectedHashedPass = await bcrypt.hash(req.body.password, 10);
            const newUser = {
                username: req.body.username,
                password: protectedHashedPass,
            };

            await collection.insertOne(newUser);
            res.send("User Created successfully");
        }
    })
});
app.get('/user', ((req, res) => {
    console.log(req.body);
}));


app.listen(33845, () => {
    console.log("server started at http://localhost:33845");
})