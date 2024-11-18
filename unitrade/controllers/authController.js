const bcrypt = require('bcrypt');
const passport = require('passport');
const { createUser, getUserByName } = require('../models/userModel');

const renderLogin = (req, res) => {
    const username = req.body.username || ''; // Default to an empty string if not provided
    const messages = req.flash();            // Retrieve flash messages
    if(req.isAuthenticated()){
        res.redirect('dashboard');
    }
    else{
        res.render('login', { username, messages });
    }
};

const renderRegister = (req, res) => {
    const username = req.body.username || ''; // Retain form data on validation error
    const email = req.body.email || '';       // Retain form data on validation error
    const messages = req.flash();            // Retrieve all flash messages

    res.render('register', { username, email, messages });
};

const handleRegister = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validation Errors
    const errors = [];
    if (username.length < 8) errors.push('Username must be at least 8 characters.');
    if (!validator.isEmail(email)) errors.push('Invalid email address.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');
    if (password.length < 8) errors.push('Password must be at least 8 characters.');

    if (errors.length > 0) {
        req.flash('error', errors); // Add errors to flash messages
        return res.redirect('/api/register');
    }

    try {
        // Check if user already exists
        const existingUser = await getUserByName(username);
        if (existingUser) {
            req.flash('error', 'Username is already taken.');
            return res.redirect('/api/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/api/login');
    } catch (err) {
        console.error('Error during registration:', err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/api/register');
    }
};


const handleLogout = (req, res) => {
    req.logout(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/api/login');
    });
};

module.exports = { renderLogin, renderRegister, handleRegister, handleLogout };
