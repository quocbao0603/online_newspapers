const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("./models/user.model");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = await userModel.getUserByUserName(username);
    if (user == null) {
      const _message = {
        error: "Tên tài khoản không tồn tại!",
        username: username,
        password: password,
      };
      const my_message = JSON.stringify(_message);
      return done(null, false, { message: my_message });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        //if (password === user.password) {
        return done(null, user);
      } else {
        _message = {
          error: "Mật khẩu không chính xác!",
          username: username,
          password: password,
        };
        const my_message = JSON.stringify(_message);
        return done(null, false, { message: my_message });
      }
    } catch (e) {
      return done(e);
    }
  };

  const login_with_linked = async function (profile, cb) {
    console.log(profile);
    console.log(profile.emails[0].value);
    console.log(profile.provider);
    const check_linked_user = await userModel.getIdByUIdAndProvider(
      profile.id,
      profile.provider
    );
    if (check_linked_user === undefined) {
      const check_email = await userModel.getUserIdByEmail(profile.emails[0].value);
      var userId = 0;
      if (check_email === undefined) {
        console.log("insert");
        const new_user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          permission: 0,
        };
        userId = await userModel.addUser(new_user);
      }
      else{
        console.log("a");
        userId = check_email.id;
      }
      console.log(userId);
      const new_linkedUser = {
        uId: profile.id,
        userId: userId,
        provider: profile.provider,
      };
      console.log(new_linkedUser);
      await userModel.addLinkedUser(new_linkedUser);
      return cb(null, await userModel.getUserById(userId));
    }
    return cb(null, await userModel.getUserById(check_linked_user.userId));
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authenticateUser
    )
  );
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_API_SECRET,
        callbackURL: "/account/facebook/return",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async function (accessToken, refreshToken, profile, cb) {
        return login_with_linked(profile, cb);
      }
    )
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/account/google/return",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      function (accessToken, refreshToken, profile, cb) {
        return login_with_linked(profile, cb);
      }
    )
  );
  passport.serializeUser((user, done) => {
    console.log(user.id);
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(null, await userModel.getUserById(id));
  });
}

module.exports = initialize;
