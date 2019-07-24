var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var User = require("../models/user");
var Investment = require("../models/investment");
var middleware = require("../middleware/middleware");


//Portfolio Routes
//form for new portfolio
router.get("/portfolio/new", middleware.isTrader, (req, res) => {
    //find all investments to display as options
    Investment.find({}, (err, allInvestments) => {
        if (err) {
            console.log(err);
        } else {
            // pass investments to template
            res.render("addPortfolio", { investments: allInvestments })
        }
    });
});

//create new portfolio
router.post("/portfolio", middleware.isTrader, (req, res) => {
    // check if 100%
    const sumPercent = obj => Object.values(obj).reduce((a, b) => parseInt(a) + parseInt(b));
    if (sumPercent(req.body.investment) === 100) {
        //make portfolio obj
        let portfolio = req.body.portfolio;
        //set initial balance
        portfolio.balance = 0;
        //initiate investment array
        portfolio.investment = [];

        //find all available investments
        Investment.find({}, (err, allInvestments) => {
            if (err) {
                console.log(err);
            } else {
                //run through each investment
                allInvestments.forEach(foundInvestment => {
                    //check if investment added to portfolio
                    if (req.body.investment[foundInvestment._id] > 0) {
                        var inv = {};
                        inv.id = foundInvestment._id;
                        inv.ratio = req.body.investment[foundInvestment._id];
                        //add investment to portfolio
                        portfolio.investment.push(inv);
                    }
                });
            }
            //create portfolio in database
            Portfolio.create(portfolio, (err, newPortfolio) => {
                err ? (console.log(err)) : (console.log(newPortfolio));
            })
            res.redirect("/show");
        });
    } else {
        res.send("percentage not 100");
    }
});

// buy portfolios
router.post("/portfolio/:id", middleware.isLoggedIn, (req, res) => {
    let amt = parseInt(req.body.amt);
    let portfolioId = req.params.id;
    let userId = req.user.id;

    console.log(amt, portfolioId, userId);

    if (req.user.balance >= amt) {
        //find investments in portfolio
        Portfolio.find({ _id: portfolioId }).populate("investment.id").exec((err, foundPortfolios) => {
            if (err) {
                console.log(err);
            } else {
                //run through each investment
                foundPortfolios[0].investment.forEach(investment =>{
                    let invId = investment.id._id;
                    let invAmt = (amt*(investment.ratio/100))
                    //add investment in users investments
                    User.findOneAndUpdate({ _id: userId }, { $addToSet:{investments: {id:invId, invested:invAmt}} }, (err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(doc);
                        }
                    });
                    //add user in investment and increase balance
                    Investment.findOneAndUpdate({ _id: invId }, { $inc: { balance: invAmt }, $addToSet:{investors: userId} }, (err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(doc);
                        }
                    });
                });
            }
        });

        //update users portfolio list and reduse balance
        User.findOneAndUpdate({ _id: userId }, { $inc: { balance: (-amt), invested: amt }, $addToSet: { portfolios: { id: portfolioId, invested:amt } } }, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        });

        // update portfolios investor list and increase balance
        Portfolio.findOneAndUpdate({ _id: portfolioId }, { $inc: { balance: amt }, $addToSet: { investors: userId } }, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        });
    }

    res.redirect("/show");
});

module.exports = router;