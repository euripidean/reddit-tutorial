// Environment
require('dotenv').config();
// Set db
require('./data/reddit-db');

// Requirements
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const checkAuth = require('./middleware/checkAuth');
const moment = require('moment');
const Handlebars = require('handlebars');

// App
const app = express();
PORT = process.env.PORT;

// Handlebars
exphbs = require('express-handlebars');

Handlebars.registerHelper('dateFormat', function(date, format) {
    return moment(date).format(format);
});

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);

// Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    }));

// Flash
app.use(flash());

// Flash messages
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
  });

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);


app.listen(3000, () => {
    console.log('Reddit clone listening on port 3000');
    });

module.exports = app;
