const express = require('express');
const passport = require('passport');
const { renderLogin, renderRegister, handleRegister, handleLogout } = require('../controllers/authController');
const ensureAuthenticated = require('../middleware/ensureAuth');

const router = express.Router();

router.get('/api/login', renderLogin);
router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Pass error to the default Express error handler
        }
        if (!user) {
            // Login failed; flash an error message and render the login page with the username
            req.flash('error', info.message || 'Invalid username or password.');
            return res.render('login', {
                username: req.body.username || '', // Preserve entered username
                messages: req.flash()            // Retrieve flash messages
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle error during login
            }
            return res.redirect('/api/dashboard'); // Redirect to dashboard on success
        });
    })(req, res, next);
});


router.get('/api/register', renderRegister);
router.post('/api/register', handleRegister);

router.get('/api/logout', handleLogout);

router.get('/api/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

module.exports = router;
