var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//Initial landinp page route
router.get("/", function(req,res){
   res.render("start");
});

//======
//Auth Routes
//======

//REGISTER routes
//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handling user sign up

router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
});

//login logic
//Middleware
router.post("/login",passport.authenticate("local",
{
   successRedirect:"/homepage",
   failureRedirect:"/login"
}) ,function(req, res) {
});

//Logout logic
router.get("/logout", function(req, res) {
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

module.exports = router;