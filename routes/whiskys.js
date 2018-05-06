var express = require("express"),
    router  = express.Router(),
    Whisky  = require("../models/whisky"),
    bodyParser = require("body-parser"),
    path    = require("path"),
    crypto  = require("crypto"),
    mongoose = require("mongoose"),
    multer = require("multer"),
    GridFsStorage = require("multer-gridfs-storage"),
    Grid = require("gridfs-stream"),
    methodOverride = require("method-override"),
    mLab = require("../custom_modules/db_connection")


//connects to Mongo and creates the collection    
let gfs;

mLab.once('open', function () {
  gfs = Grid(mLab.db, mongoose.mongo);
  gfs.collection('uploads');
});
   
// Create storage engine
var storage = new GridFsStorage({
  url: "mongodb://tobias:12345@ds129706.mlab.com:29706/whisky_page",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        var filename = buf.toString('hex') + path.extname(file.originalname);
        var fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
var upload = multer({ storage });   
   


   
//NEW shows form to create new entry
router.get("/homepage",isLoggedIn, function(req,res){
   res.render("homepage");
   console.log("server startet");
});



//INDEX Path lists all whiskies
router.get("/collection",isLoggedIn, function(req,res){
   Whisky.find({"author.username": req.user.username}, function (err,allWhisky){
      if (err){
         console.log(err);
      }else{
         Whisky.count({"author.username": req.user.username},function(err, count){
            if (count){
               res.render("index", {
                  whisky: allWhisky,
                  count: count
               });
            }else {
               res.render("index", {
                  whisky: allWhisky,
                  count: "0"
               });
            }
         }); 
       }
   }); 
});

//CREATE new entry
router.post("/collection",upload.single('file'), function(req,res){
   var date = req.body.date;
   var distillery = req.body.distillery;
   var age = req.body.age;
   var name = req.body.name;
   var cask = req.body.cask;
   var region = req.body.region;
   var taste = req.body.taste;
   var image = req.body.image;
   var comment = req.body.comment;
   var author = {
        id: req.user._id,
        username: req.user.username
    };
   var picture = {
       id: req.file.id,
       fileName: req.file.filename
   }; 

   var newWhisky = {date: date, 
                    distillery: distillery, 
                    age:age, 
                    name:name, 
                    cask: cask, 
                    region:region, 
                    taste:taste, 
                    image:image, 
                    comment:comment, 
                    author: author, 
                    picture: picture};
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
            console.log(err + "here");
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

// @desc Display Image uploaded from device; internal API for retrieval (in ejs)
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


//login check for all routes (middleware)
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
     return next();
   }
     res.redirect("/login");   
}


module.exports = router;