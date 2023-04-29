require('dotenv').config();
// Set db
require('./data/reddit-db');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
PORT = process.env.PORT;

exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

app.get('/', (req, res) => {
    res.render('home');
    });

app.listen(3000, () => {
    console.log('Reddit clone listening on port 3000');
    });

module.exports = app;
