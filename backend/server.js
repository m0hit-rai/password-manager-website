const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const credentials = require('./mongo-password');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const uri = `mongodb+srv://${credentials.username}:${credentials.pass}@pass-manage.6z6kk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let user_credentials_collection, user_data_collection;
client.connect().then(() => {
    user_credentials_collection = client.db("password-manage").collection("user-credentials");
    user_data_collection = client.db("password-manage").collection("user-stored-pass");
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
    user_credentials_collection.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) {
            res.status(500).send("Some error occured!");
            throw err;
        }
        else if (!doc) {
            res.status(404).send("Username not found!");
        }
        else {
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
                if (err) {
                    res.status(500).send("Some error occured!");
                    throw err;
                }

                if (result)
                    res.send("User Logged in");
                else
                    res.status(401).send("Wrong Password!");
            });
        }
    });
});


app.post('/register', async (req, res) => {
    user_credentials_collection.findOne({ username: req.body.username }, async (err, doc) => {
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

            await user_credentials_collection.insertOne(newUser);
            res.send("User Created successfully");
        }
    })
});

app.post('/addPass', (req, res) => {
    // request will have
    // current username(the one inserting the password),
    // the site's name/address, the sites's username, the site's password, a short note about the site.
    // console.log(req);
    const newDoc = {
        username: req.body.username,
        site: req.body.site,
        siteUsername: req.body.siteUsername,
        sitePassword: req.body.sitePassword,
        note: req.body.note,
    }
    // console.log(newDoc);
    user_data_collection
        .insertOne(newDoc)
        .then(() => {
            res.send("Password Added");
        })
        .catch((err) => {
            res.status(500).send("Some error occured!");
            throw err;
        })
    // res.send("testing phase")
});

app.get('/user/:username', async (req, res) => {
    // request body will contain a username, display all its password
    // console.log(req.params);
    // res.status(404).send("Did it motherfudger!")
    const query = { username: req.params.username };
    const options = {
        sort: { site: 1 }
    }

    try {
        const cursor = user_data_collection.find(query, options);
        let data = [];

        await cursor.forEach(element => {
            const { _id, username, site, siteUsername, sitePassword, note } = element;
            const newData = {
                key: _id,
                username: username,
                site: site,
                siteUsername: siteUsername,
                sitePassword: sitePassword,
                note: note,
            }
            data.push(newData);
            // console.log(newData);
        });

        res.send(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error occurred");
    }
});


app.get('/deleteData/:passId', async (req, res) => {
    const query = { _id: new ObjectId(`${req.params.passId}`) };
    console.log(query);
    try {
        let result = await user_data_collection.deleteOne(query);
        console.log(result);
        res.send(`Deleted Sucessfully`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(`Error occurred`)
    }
});


app.listen(33845, () => {
    console.log("server started at http://localhost:33845");
})