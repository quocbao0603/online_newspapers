const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
const passport = require("passport");

const userModel = require("../models/user.model");
const auth = require("../middlewares/auth.mdw");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const initializePassport = require("../passport-config");
const { registerCustomQueryHandler } = require("puppeteer");
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

router.get("/profile", auth,async function(req, res) {
    const user = req.user;
    user.dob = moment(user.dob, "YYYY-MM-DD").format("MM/DD/YYYY");
    let premium = await userModel.getTimePremium(user.id);
    premium = moment(premium, "YYYY-MM-DDTh:m:s").format("MM/DD/YYYY");

    console.log(premium)
    res.render("vwAccount/profile", { infoUser: user,
    premium: premium });
});

router.post("/profile/", auth, async function(req, res) {
    //console.log(req.body.premium)
    const user_update = req.user;
    //update nhung j?
    user_update.name = req.body.name;
    user_update.email = req.body.email;
    user_update.dob = req.body.dob;
    user_update.dob = moment(user_update.dob).format("YYYY-MM-DD");
    user_update.pre = moment(req.body.premium).format("YYYY-MM-DD");
    //console.log("Test user:");
    //console.log(user_update);
    //console.log(req.body);
    await userModel.patch(user_update);
    const url = req.session.retUrl || "/";
    res.redirect(url);
    //const url = "/account/profile/patch";
    //console.log("TEST URL patch: ");
    //console.log(url);
    //res.render("vwAccount/profile", { infoUser: user_update });
});

router.post("/resPremium", auth, async function(req, res) {
    //console.log(req.body.premium)
    console.log(req.body.timePremium)
    //await userModel.updatePremium(req.user.id, +req.body.times)
    await userModel.setPremium(req.user.id,req.body.timePremium)
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
        return res.redirect("/");
    }
    next();
}

router.get('/forgot-password', checkNotAuthenticated, (req, res, next) => {
    res.render("vwAccount/forgot-password", {
        layout: false,
    });
});


let user_1 = {
    id: "Bauz",
    email: "qbao0603@gmail.com",
    password: "123421uio3h12jkafjkasfghajksgh"
}

const JWT_SECRET = "some super secret...";

router.post('/forgot-password', checkNotAuthenticated, async(req, res, next) => {
    const { email } = req.body;
    //Make  sure user exist in DB
    const user_reset_password = await userModel.getUserIdByEmail(
        email
    );
    console.log(user_reset_password);
    if (user_reset_password === undefined) {
        res.send("Email không tồn tại!");
        return;
    }

    //User exist and now create one time link valid for 15 minutes
    const secret = JWT_SECRET + user_reset_password.password;
    const payload = {
        email: user_reset_password.email,
        id: user_reset_password.id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    req.session.user_reset_password = user_reset_password;
    //Send OTP to email
    const link = `http://localhost:3000/account/reset-password/${user_reset_password.id}/${token}`;
    username = user_reset_password.email;
    const testAccount = await nodemailer.createTestAccount();
    //Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "qbao060300@gmail.com", // TODO: your gmail account
            pass: "Bao060320000", // TODO: your gmail password
        },
    });
    // Step 2
    const message_gmail =
        `Hello, ${username}
Your email was provided for reset our News WebApp and you were successfully reset.\n
To reset your password please follow the link: ${link}.\n
Thank you for your interest in News WebApp.\n
If it was not you, just ignore this letter.\n\n
With best regards,\n
News WebApp Team.\n
`
    const mailOptions = {
        from: 'qbao060300@gmail.com', // sender address
        to: 'qbao060300@gmail.com', //username, // list of receivers
        subject: "News-WebApp - Email confirmation", // Subject line
        text: message_gmail, // plain text body
        //html: '<h1>Welcome</h1><p>That was easy!</p>', // html body
    };

    //Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs');
        }
        return console.log('Email sent!!!');
    });

    console.log(link);
    res.send('Password reset link has been sent to ur email...');

    /* const url = "/";
    res.redirect(url); */

});

router.get('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;
    //res.send(req.params);
    //return;
    const user = req.session.user_reset_password;
    //check if this id exist in DB
    //console.log(user);
    const user_check = userModel.getUserById(id);
    /* if (id !== user.id) {
        res.send("Invalid ID...");
        return;
    } */
    if (user_check === undefined) {
        res.send("Invalid ID...");
        return;
    }

    //we have a valid id & we have a valid user with this ID
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render("vwAccount/reset-password", {
            layout: false,
            email: user.email
        });
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
});

router.post('/reset-password/:id/:token', async(req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    //check if this id exist in DB
    const user_check = userModel.getUserById(id);
    /* if (id !== user.id) {
        res.send("Invalid ID...");
        return;
    } */
    if (user_check === undefined) {
        res.send("Invalid ID...");
        return;
    }

    const user = req.session.user_reset_password;
    //we have a valid id & we have a valid user with this ID
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        //validate password & password2 should match
        //we can simply find the user with the payload and id  and finally update with the new password
        //NOte: always hash password before saving 

        //user.password = password
        const hashedPassword = await bcrypt.hash(password, 10);
        const new_user = await userModel.updatePassword(user.id, hashedPassword);
        console.log("Test pass:");
        console.log(hashedPassword);
        console.log(password);
        console.log(new_user);
        //res.send(user);
        //alert("Đổi mật khẩu thành công");
        const url = "/account/login";
        res.redirect(url);
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
});



module.exports = router;