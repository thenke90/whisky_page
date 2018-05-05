var mongoose = require("mongoose")

module.exports = mongoose.connect("mongodb://tobias:12345@ds129706.mlab.com:29706/whisky_page", {useMongoClient: true});

 