var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isTrader: {type: Boolean, default: false},
    balance: Number,
    investments: [
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Investment"
            },
            invested: Number
        }
    ],
    portfolios: [
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Portfolio"
            },
            invested: Number
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);