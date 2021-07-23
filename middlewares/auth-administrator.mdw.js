module.exports = function authAdministrator(req, res, next) {
    if (req.isAuthenticated()) {
      
      if(req.user.permission == "3"){
        console.log("administrator");
        return next();}
      else{
        res.redirect('/');
      }
    }
    else{
      req.session.retUrl = req.originalUrl;
      res.redirect('/account/login');
    }
  }