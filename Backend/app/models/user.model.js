const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    token: String,
    firstname: String,
    lastname: String,
    profilePicture: String,
    email: String,
    password: String,
    status: Boolean,
  })
);

module.exports = User;
