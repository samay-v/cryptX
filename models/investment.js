var mongoose = require("mongoose");

var investmentSchema = mongoose.Schema({
    name : String,
    balance : Number,
    target : Number,
    investors :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    portfolios : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Portfolio"
        }
    ]
});

module.exports = mongoose.model("Investment", investmentSchema); 