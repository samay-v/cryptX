// all middleware
var Portfolio = require("../models/portfolio");
var Investment = require("../models/investment");
var User = require("../models/user");
var middlewareObj = {};

//Check if the current user has a a trading account 
middlewareObj.isTrader = (req, res, next)=>{
    if(req.user.isTrader){
        return next();
    }
}

//check if user is logged in 
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = middlewareObj;