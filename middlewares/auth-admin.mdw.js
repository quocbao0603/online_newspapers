module.exports = function authWriter(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.permission == "3") {
            console.log("admin");
            return next();
        } else {
            res.redirect('/');
        }
    } else {
        req.session.retUrl = req.originalUrl;
        res.redirect('/account/login');
    }
}