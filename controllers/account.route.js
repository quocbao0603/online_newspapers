const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
const passport = require("passport");

const userModel = require("../models/user.model");
const auth = require("../middlewares/auth.mdw");


const initializePassport = require("../passport-config");
initializePassport(passport);

const router = express.Router();

router.get("/login/style.css", (req, res) => {
    res.sendFile("style.css", { root: "./views/vwAccount" });
});
router.get("/login/script.js", (req, res) => {
    res.sendFile("script.js", { root: "./views/vwAccount" });
});

router.get("/is-correct", async function(req, res) {
    const username = req.query.user;
    const password = req.query.pw;
    const user = await userModel.getUserByUserName(username);
    console.log(user);
    if (user === undefined) {
        return res.json("Invalid username!");
    }
    if (await bcrypt.compare(password, user.password)) {
        return res.json("Correct");
    }
    return res.json("Invalid password!");
});

router.get("/is-available", async function(req, res) {
    const username = req.query.user;
    const user = await userModel.getUserByUserName(username);
    if (user === undefined) {
        return res.json(true);
    }

    res.json(false);
});

router.get("/profile", auth, function(req, res) {
    const user = req.user;
    user.dob = moment(user.dob, "YYYY-MM-DD").format("MM/DD/YYYY");

    //console.log(user)
    res.render("vwAccount/profile", { infoUser: user });
});

router.post("/profile/patch", auth, async function(req, res) {
    //console.log(req.body.premium)
    const user_update = req.user;
    //update nhung j?
    user_update.name = req.body.name;
    user_update.email = req.body.email;
    user_update.dob = req.body.dob;
    //console.log("Test user:");
    //console.log(user_update);
    //console.log(req.user);
    await userModel.patch(user_update);
    //const url = req.session.retUrl || "/account/profile/patch";
    //const url = "/account/profile/patch";
    //console.log("TEST URL patch: ");
    //console.log(url);
    res.render("vwAccount/profile", { infoUser: user_update });
});

router.post("/resPremium", auth, async function(req, res) {
    //console.log(req.body.premium)
    console.log(req.body.times)
    await userModel.updatePremium(req.user.id, +req.body.times)
    const url = req.session.retUrl || "/";
    console.log(url)
    res.redirect(url);
});

router.get("/resPremium", function(req, res) {
    const user = req.user;
    user.dob = moment(user.dob, "YYYY-MM-DD").format("DD/MM/YYYY");
    res.render("vwAccount/resPremium", { infoUser: user });
})

router.get("/login", async function(req, res) {
    res.render("vwAccount/login", {
        layout: false,
    });
});

router.post("/login", checkNotAuthenticated, function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/account/login");
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            console.log(req.session.retUrl);
            const url = req.session.retUrl || "/";
            return res.redirect(url);
        });
    })(req, res, next);
});

router.get(
    "/login/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
    "/facebook/return",
    passport.authenticate("facebook", { failureRedirect: "/account/login" }),
    login_with_facebook_and_google
);
router.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/return",
    passport.authenticate("google", { failureRedirect: "/error" }),
    login_with_facebook_and_google
);

router.post("/register", checkNotAuthenticated, Create_user_in_db);

router.post("/logout", (req, res) => {
    req.logOut();
    req.session.retUrl = "";

    const url = req.headers.referer || "/";
    res.redirect(url);
});

async function Create_user_in_db(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const dob = moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD");
    const new_user = {
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name,
        email: req.body.email,
        dob: dob,
    };
    await userModel.addUser(new_user);
    res.redirect("/account/login");
}

async function login_with_facebook_and_google(req, res) {
    res.redirect("/");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/index");
    }
    next();
}
module.exports = router;