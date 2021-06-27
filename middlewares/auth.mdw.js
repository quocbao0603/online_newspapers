module.exports = function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
    req.session.retUrl = req.originalUrl;
    res.redirect('/account/login');
}