var mongoose = require("mongoose");

// Schema setup test
var whiskySchema = new mongoose.Schema({
   date:Date,
   distillery:String,
   age: String,
   name: String,
   cask: String,
   region: String,
   taste:Number,
   image:String, 
   comment: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("whisky", whiskySchema);