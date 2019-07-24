const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seed"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js");

require('dotenv').config();
const db_pass = process.env.DB_PASS;
//routes
const authenticationRoutes = require("./routes/authentication"),
    cryptxRoutes = require("./routes/cryptx")
    portfolioRoutes = require("./routes/portfolio")
    investmentRoutes = require("./routes/investment")

//MongoDB setup
const dbUrl = `mongodb+srv://admin:${db_pass}@cluster0-me3oo.mongodb.net/test?retryWrites=true&w=majority`;
console.log(dbUrl)
mongoose.connect(dbUrl, { useNewUrlParser: true }).then(()=>{
    console.log("DB connected");
}).catch(err =>{
    console.log("DB ERROR", err.message);
});
mongoose.set('useFindAndModify', false);
    // seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "once again set up",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


//generals
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//use routes
app.use(cryptxRoutes);
app.use(authenticationRoutes);
app.use(portfolioRoutes);
app.use(investmentRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("server is working for cryptX on port: ", PORT);
});