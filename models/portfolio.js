var mongoose = require("mongoose");

var portfolioSchema = mongoose.Schema({
    name: String,
    creatorName: String,
    balance: Number,
    target: Number,
    investors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    investment: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Investment"
            },
            ratio: Number
        }
    ]
});

module.exports = mongoose.model("Portfolio", portfolioSchema); 