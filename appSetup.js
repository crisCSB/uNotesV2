const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

const mysql = require("mysql2");

const con = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database:""
});


const sessions = require('express-session');
const cookieParser = require("cookie-parser");

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

module.exports = {app, con, port};