const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const ObjectID = require("mongodb").ObjectID;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Create new user - SignUp
exports.signup = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  var profilePic = null;
  if (req?.file?.filename) {
    profilePic = url + "/public/" + req.file.filename;
  }
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    status: req.body.status,
    profilePicture: profilePic,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ status: true, message: "User was registered successfully!" });
    });
  });
};

// To login user
exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (user.status === false) {
      return res.status(401).send({ message: "User is Inactive!" });
    }
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    User.updateOne(
      { _id: new ObjectID(user._id) },
      { $set: { token: token } },
      (err) => {
        if (err) {
          return res.json({ status: false, token: "" });
        }
      }
    );
    res.status(200).send({
      _id: user._id,
      token: token,
      firstname: user.firstname,
      lastname: user.lastname,
      status: req.body.status,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  });
};
// To logout user
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
