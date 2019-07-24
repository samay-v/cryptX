var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");


//show registration form
router.get("/register", (req, res) => {
    res.render("register");
})

//add registration\
router.post("/register", (req, res) => {
    
    var newUser = new User({ username: req.body.username, balance: req.body.balance });
    
    //set trading account type
    if (req.body.userType === 'trader') {
        newUser.isTrader = true;
    }

    //register user with passport.js
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/show");
        });
    });
});

//Login show
router.get("/login", (req, res) => {
    res.render("login");
});

//Login post
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/show",
        failureRedirect: "/login"
    }), (req, res) => {
    });

//logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;