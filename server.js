const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const { hostname } = require('os');





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
/* 
secret — a private key used to sign the cookie 
so it can't be faked. 

resave: false — don't save the session if nothing changed
saveUninitialized: false — don't create a session until the user actually logs in
cookie: { secure: false } — set this to true later when you add HTTPS on your domain. Keep it false for local development
*/

const db = mysql.createPool({
    host: 'localhost',
    user: 'auth_user',
    password: 'password',
    database: 'auth_app'
});
/* A pool is for keeping a set of connections to the database open at all times for faster overall prosessing */






app.post('/signup', async (req, res) => {
    const { email, password } =req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required."});
    }

    /*
req.body — the email and password sent from your HTML
the if check — makes sure both fields are actually filled in before doing anything. 400 means "bad request"
    */
    try {
        const [rows] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }
            /*
    try — wraps the database code so if something goes wrong it doesn't crash the server. You'll see the matching catch at the end
    db.query — sends a SQL question to your database. "find me a user with this email"
    [rows] — the result comes back as an array, rows is the list of users found
    rows.length > 0 — if anything was found, that email is already taken
    409 — means "conflict", something already exists
    */
        const hash = await bcrypt.hash(password, 12);
        await db.query('INSERT INTO Users (email, password_hash) VALUES (?, ?)', [email, hash]);

        res.status(201).json({ message: 'Account created! You can now sign in.'});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});
/*
catch — if anything inside try breaks, this runs instead of crashing the server
console.error — prints the real error in your terminal so you can see what went wrong
500 — means "server error", something went wrong on your end
*/



app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(' SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];
        /*
rows.length === 0 — no user found with that email
401 — means "unauthorized", wrong credentials
const user = rows[0] — grabs the first result since email is unique there will only ever be one
        */
    
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        return res.status(401).json({ message: ' Invalid email or password.' });
    }
/*
    bcrypt.compare — takes the plain text password the user typed and compares it to the hash stored in your database. Returns true or false
!match — if they don't match, send back the same error message as before
*/

    req.session.userId = user.id;
    res.json ({ message: 'Signed In!'});
    /*
    req.session.userId — saves the users id into the session. This is how the server remembers who is logged in for future requests
    res.json — sends back success. No status code needed here, it defaults to 200 which means "ok"
    */
    } catch (err){
        console.error(err);
        res.status(500).json({ message: ' Server error.'});
    }
});


app.post('/signout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Signed out.' });
});


app.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json ({ loggedIn: false });
    }
});



app.get('/getemail', (req, res) => {
    
    if (req.session.userId) {
        res.json({ email: req.session.userEmail });
    } else {
        res.json({ email: null });
    }


});


app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard'));
});

/*
req.session.userId — checks if there is an active session
! — means "not". So if there is NOT a session, redirect to login
res.redirect — sends the user to a different page
res.sendFile — if they are logged in, serve the dashboard page
*/



app.listen(5700, () => console.log('Server running on http://localhost:5700 and 10.2.3.26:5700'));