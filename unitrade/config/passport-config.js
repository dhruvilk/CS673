const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { getUserByName, getUserById } = require('../models/userModel');

function initializePassport(passport) {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await getUserByName(username);
            if (!user) return done(null, false, { message: 'No user with that username.' });

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) return done(null, user);
            else return done(null, false, { message: 'Password incorrect.' });
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}

module.exports = initializePassport;
