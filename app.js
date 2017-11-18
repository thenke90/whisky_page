var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   catNames = require('cat-names')

mongoose.connect("mongodb://localhost/whisky");
app.use(bodyParser.urlencoded({exntended: true}));
app.set("view engine", "ejs");

// Schema setup
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

var Whisky = mongoose.model("Whisky", whiskySchema);

app.get("/", function(req,res){
   res.render("homepage");
   console.log("server startet, neue Katze:"+""+catNames.random());
});

app.get("/collection", function(req,res){
   Whisky.find({}, function (err,allWhisky){
      if (err){
         console.log(err);
      }else {
         res.render("collection", {whisky: allWhisky});
      }
      
   });
});


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


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");  
});