module.exports = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.session.intent = '/user' + req.path;
        req.flash('danger', 'Please login to continue');
        res.redirect('/login');
    }
}