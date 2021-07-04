module.exports = function authWriter(req, res, next) {
  if (req.isAuthenticated()) {
    
    if(req.user.permission == "2"){
      console.log("editor");
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