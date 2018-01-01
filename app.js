var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   catNames = require('cat-names'),
   methodOverride = require("method-override")

//mongoose.connect("mongodb://localhost/whisky");
mongoose.connect("mongodb://tobias:12345@ds129706.mlab.com:29706/whisky_page", {useMongoClient: true});
app.use(bodyParser.urlencoded({exntended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

//NEW shows form to create new entry
app.get("/", function(req,res){
   res.render("homepage");
   console.log("server startet, neue Katze:"+""+catNames.random());
});

//INDEX Path lists all whiskies
app.get("/collection", function(req,res){
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
app.get("/collection/:id", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("server started");  
});