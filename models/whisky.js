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
         },
   picture: {
      id: String,
      fileName:String,
   }
});
//model name whisky gets pluralized to collection name whiskies
module.exports = mongoose.model("whisky", whiskySchema);