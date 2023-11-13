var mongoose = require("mongoose");
var plm = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate"); // Add this line
require('dotenv').config();

const DB = `mongodb+srv://rapidemporium:${process.env.MONGO_PASSWORD}@cluster0.xhnizbn.mongodb.net/?retryWrites=true&w=majority`;

try {
  mongoose.connect(DB).then(function() {
    console.log("Database is now connected!");
  });
} catch (err) {
  console.error("Connection error:", err);
}

var userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

userSchema.plugin(plm, { usernameField: "email" });
userSchema.plugin(findOrCreate); // Use the findOrCreate plugin
module.exports = mongoose.model("user", userSchema);
