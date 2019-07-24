var mongoose = require("mongoose"),
 Investment = require("./models/investment");

var data = [
    {
        name: "investment 1", 
        balance: 0,
        target: 1000000
    },
    {
        name: "investment 2", 
        balance: 0,
        target: 1000000
    },
    {
        name: "investment 3", 
        balance: 0,
        target: 1000000
    },
    {
        name: "investment 4", 
        balance: 0,
        target: 1000000
    },
    {
        name: "investment 5", 
        balance: 0,
        target: 1000000
    },
]

function seedDB(){
   //Remove all investment
   Investment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed investment!");
         //add a few investment
        data.forEach(function(seed){
            Investment.create(seed, function(err, investment){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a investment");
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;