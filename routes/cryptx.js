var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var Investment = require("../models/investment");
var User = require("../models/user");
var middleware = require("../middleware/middleware");

//index
router.get("/", (req, res)=>{
    res.render("index");
});

//lists investments and portfolio
router.get("/show", (req, res) => {
    //find All investments
    Investment.find({}, (err, foundInvestments) => {
        if (err) {
            console.localStorage(err);
        } else {
            // find all portfolios and the investments in them
            Portfolio.find({}).populate("investment.id").exec((err, foundPortfolios) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundPortfolios);
                    res.render("show", { portfolios: foundPortfolios, investments: foundInvestments });
                }
            });

        }
    });
});

//show all users
router.get("/user/:id", middleware.isLoggedIn, (req, res)=>{
    //find users and populate them with the investments and the portfolios
    User.findById(req.params.id).populate("investments.id").populate("portfolios.id").exec((err, foundUser)=>{
        res.render("showUsers", {user : foundUser})
    });
});

module.exports = router;