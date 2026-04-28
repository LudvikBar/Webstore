const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');





const app = express(); /* starts express server, this is like turning on the server*/


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use() means "run this on every request".

express.json() — lets your server read the JSON data sent 
from your HTML fetch calls. Without this, req.body would be empty

express.static(...) — serves everything in your public/ folder 
automatically. This is how your HTML and CSS files 
get sent to the browser
*/

app.use(session({
    secret: 'ksdoeqmxcnbaieqlpory',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))