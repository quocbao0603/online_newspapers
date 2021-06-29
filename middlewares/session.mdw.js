const session = require("express-session");
const passport = require("passport");

module.exports = function (app) {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: "work hard",
      resave: false,
      saveUninitialized: false,
      // cookie: {
      //   maxAge: 1000 * 50 * 5, //đơn vị là milisecond
      // },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
