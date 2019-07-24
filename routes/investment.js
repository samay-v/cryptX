var express = require("express");
var router = express.Router();
var Portfolio = require("../models/portfolio");
var Investment = require("../models/investment");
var User = require("../models/user");
var middleware = require("../middleware/middleware");


// buy investments
router.post("/investment/:id", middleware.isLoggedIn, (req, res) => {
    //params to be used
    let amt = parseFloat(req.body.amt);
    let invId = req.params.id;
    let userId = req.user.id;

    //check if user has balance
    if (req.user.balance >= amt) {
        //update user balance and add investment to its list of investments
        User.findOneAndUpdate({ _id: userId }, { $inc: { balance : (-amt), invested : amt} , $addToSet:{investments: {id:invId, invested:amt}} }, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        });

        //update investment balance and add user to the list of users
        Investment.findOneAndUpdate({ _id: invId }, { $inc: { balance: amt }, $addToSet:{investors: userId} }, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        });
    }

    res.redirect("/show")
});

module.exports = router;