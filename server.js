// Environment
require('dotenv').config();
// Set db
require('./data/reddit-db');

// Requirements
const express = require('express');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const checkAuth = require('./middleware/checkAuth');

// App
const app = express();
PORT = process.env.PORT;

// Handlebars
exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);
app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    }));


require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

app.get('/', (req, res) => {
    const successMessage = req.flash('successMessage');
    const showMessage = req.query.success;
    res.render('home', { successMessage, showMessage });
    });

app.listen(3000, () => {
    console.log('Reddit clone listening on port 3000');
    });

module.exports = app;
