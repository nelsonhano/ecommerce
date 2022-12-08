module.exports = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        req.session.intent = '/admin' +req.path;
        req.flash('danger', 'Please login to continue');
        res.redirect('/admin/login');
    }
}