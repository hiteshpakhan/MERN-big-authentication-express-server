require("dotenv").config();
const express = require('express');
const cors = require("cors");
const connectDb = require("./db/dbConnections");
const cookieParser = require("cookie-parser");

const app = express()
app.use(cookieParser());

const port = 5000

//calling the database connection function here from the another file
connectDb();

//using schema for mongo database from another file
// const User = require("./model/userSchema");

//here we are creating the middleware that can help us communicate in json format
app.use(express.json());
app.use(cors());

//using api from another file this is also an middware
app.use(require("./router/auth"));

// app.get('/contact', (req, res) => res.send('Hello from contact'));

// app.get('/signin', (req, res) => res.send('Hello from signin'));

// app.get('/signup', (req, res) => res.send('Hello from signup'));

app.listen(port, () => console.log(`Example app listening on port 5000!`))
