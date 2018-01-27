var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   catNames = require('cat-names'),
   methodOverride = require("method-override"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   passportLocalMongoose = require("passport-local-mongoose"),
   User = require("./models/user"),
   Whisky = require("./models/whisky");
  
//require routes  
   
var whiskyRoutes = require("./routes/whiskys"),
    indexRoutes  = require("./routes/index");

//mongoose.connect("mongodb://localhost/whisky");
mongoose.connect("mongodb://tobias:12345@ds129706.mlab.com:29706/whisky_page", {useMongoClient: true});
app.use(bodyParser.urlencoded({exntended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
app.use(require("express-session")({
   secret:"Engelchen",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(whiskyRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");  
});