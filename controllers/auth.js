const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {

    // SIGN UP FORM
    app.get('/signup', async (req, res) => {
        try {
            res.render('signup');
        } catch {
            console.log(err.message);
        }});

    // SIGN UP POST
    app.post('/signup', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ err: err });
        }});

    // LOGOUT
    app.get('/logout', async (req, res) => {
        try {
            res.clearCookie('nToken');
            res.redirect('/');
        }
        catch (err) {
            console.log(err.message);
        }
    });

};
