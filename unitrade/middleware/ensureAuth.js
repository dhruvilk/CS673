function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else{
        req.flash('error', 'You must log in to view this page.');
        res.redirect('/api/login');
        return null;
    }
}

module.exports = ensureAuthenticated;
