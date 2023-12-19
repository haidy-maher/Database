const express = require('express');
const path = require('path');

const app = express();
const port = 5
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home'); // Render the 'home.ejs' view
});

app.get('/about', (req, res) => {
    res.render('about'); // Render the 'about.ejs' view
});

app.get('/contact', (req, res) => {
    res.render('contact'); // Render the 'contact.ejs' view
});

app.get('/login', (req, res) => {
    res.render('login'); // Render the 'login.ejs' view
});

app.get('/sessions', (req, res) => {
    res.render('sessions'); // Render the 'sessions.ejs' view
});

app.get('/createSession', (req, res) => {
    res.render('createSession'); // Render the 'createSession.ejs' view
});

app.get('/editSession', (req, res) => {
    res.render('editSession'); // Render the 'editSession.ejs' view
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
