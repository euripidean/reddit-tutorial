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
            req.flash('successMessage', 'Successfully Logged Out');
            res.redirect('/?success=true');
        }
        catch (err) {
            console.log(err.message);
        }
    });

    // LOGIN FORM
    app.get('/login', async (req, res) => {
        try {
            res.render('login');
        } catch (err) {
            console.log(err.message);
    }});

    // LOGIN
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const errorMessage = req.flash('Wrong Username or Password');
        try {
            const user = await User.findOne({ username }, 'username password');
            if (!user) {
                req.flash('Wrong Username or Password', 'Invalid username or password');
                return res.status(401).render('login', { errorMessage });
            }
            // Check the password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                req.flash('Wrong Username or Password', 'Invalid username or password');
                return res.status(401).render('login', { errorMessage });
            }
            // Create a token
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: "60 days"
            });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            req.flash('successMessage', `Welcome back ${user.username}!`);
            res.redirect('/?success=true');
        } catch (err) {
            console.log(err.message);
        }
    });
    
    
};

