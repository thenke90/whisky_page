var express = require("express"),
    router = express.Router(),
    Whisky = require("../models/whisky");


//NEW shows form to create new entry
router.get("/homepage",isLoggedIn, function(req,res){
   res.render("homepage");
   console.log("server startet");
});



//INDEX Path lists all whiskies
router.get("/collection",isLoggedIn, function(req,res){
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
router.post("/collection", function(req,res){
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
router.get("/collection/:id",function(req, res){
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


router.get("/collection/:id/remove", function(req, res){
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

//login check for all routes (middleware)
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
     return next();
   }
     res.redirect("/login");   
}


module.exports = router;