const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const initializePassport = require('./config/passport-config');
const pool = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Passport Initialization
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware for Views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.user || null; // For authenticated user access in templates
    next();
});

// Routes
app.use('/', authRoutes);

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
