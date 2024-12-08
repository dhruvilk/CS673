const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const initializePassport = require('./config/passport-config');
const {sessionStore} = require('./config/db');

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
    store: sessionStore, // Use the Sequelize session store
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false, //process.env.NODE_ENV === 'production', // Set to true in production (requires HTTPS)
        httpOnly: true, // Protects against XSS attacks
    },
}));

// Passport Initialization
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success');
    res.locals.error_message = req.flash('error');
    next();
});

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
