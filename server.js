require('dotenv').config();
const express = require('express');
const app = express();
PORT = process.env.PORT;

exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
    });



app.listen(3000, () => {
    console.log('Reddit clone listening on port 3000');
    });

