var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   catNames = require('cat-names'),
   methodOverride = require("method-override"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   passportLocalMongoose = require("passport-local-mongoose"),
   User = require("./models/user");
   

//mongoose.connect("mongodb://localhost/whisky");
mongoose.connect("mongodb://tobias:12345@ds129706.mlab.com:29706/whisky_page", {useMongoClient: true});
app.use(bodyParser.urlencoded({exntended: true}));
app.set("view engine", "ejs");

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


// Schema setup test
var whiskySchema = new mongoose.Schema({
   date:Date,
   distillery:String,
   age: String,
   name: String,
   cask: String,
   region: String,
   taste:Number,
   image:String
});

var Whisky = mongoose.model("whisky", whiskySchema);

//Initial landinp page route
app.get("/", function(req,res){
   res.render("start");
});



//NEW shows form to create new entry
app.get("/homepage",isLoggedIn, function(req,res){
   res.render("homepage");
   console.log("server startet, neue Katze:"+""+catNames.random());
});



//INDEX Path lists all whiskies
app.get("/collection",isLoggedIn, function(req,res){
   Whisky.find({}, function (err,allWhisky){
      if (err){
         console.log(err);
      }else{
         Whisky.count({},function(err, count){
            if (count){
               res.render("index", {
                  whisky: allWhisky,
                  count: count
               });
            }else {
               console.log(err);
            }
         }); 
      }
   });  
   
});

//CREATE new entry
app.post("/collection", function(req,res){
   var date = req.body.date;
   var distillery = req.body.distillery;
   var age = req.body.age;
   var name = req.body.name;
   var cask = req.body.cask;
   var region = req.body.region;
   var taste = req.body.taste;
   var image = req.body.image;
   var newWhisky = {date: date, distillery: distillery, age:age, name:name, cask: cask, region:region, taste:taste, image:image};
   //new whisky an save to db
   Whisky.create(newWhisky, function(err,newlyCreated){
         if (err){
            console.log(err);
         }else {
            res.redirect("/collection");
         }
      });
});

//Show more infors about the whisky
app.get("/collection/:id",function(req, res){
   //find whisky with specific ID
   Whisky.findById(req.params.id, function(err, foundWhisky){
          if (err){
            console.log(err);
          }else {
          //render page with details
            res.render("show", {whisky: foundWhisky});
          }  
});
});


app.get("/collection/:id/remove", function(req, res){
   Whisky.findByIdAndRemove(req.params.id, function(err, deleteWhisky){
      if (err){
         alert("uuups that didnt work");
         console.log("not deleted");
      }else{
         res.redirect("/collection");
      }
   });
   //res.send("this is the delete route");
});

//======
//Auth Routes
//======

//REGISTER routes
//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handling user sign up

app.post("/register", function(req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username }), req.body.password, function(err, user){
       if (err){
          console.log(err);
          return res.render("register");
       }else{
          passport.authenticate("local")(req,res, function(){
             res.redirect("/homepage");
          });
       }
    });
});

//LOGIN Routes
//show login form
app.get("/login", function(req, res) {
    res.render("login");
});

//login logic
//Middleware
app.post("/login",passport.authenticate("local",
{
   successRedirect:"/homepage",
   failureRedirect:"/login"
}) ,function(req, res) {
});

//Logout logic
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

//login check for all routes (middleware)
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
     return next();
   }
     res.redirect("/login");   
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");  
});