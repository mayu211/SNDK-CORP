const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const fs = require("fs");

// To get all user details
exports.getAllUser = async (req, res) => {
  let response = {
    status: false,
    message: "Missing parameters !!! ",
  };
  let params = req.query;

  // 0 = Inactive, 1 = Active, 2 = All
  if (
    params.search != undefined &&
    params.isActive != undefined &&
    (params.isActive == 0 || params.isActive == 1 || params.isActive == 2)
  ) {
    const search = new RegExp(params.search, "i");
    let where = {
      $or: [
        {
          firstname: search,
        },
        {
          lastname: search,
        },
        {
          email: search,
        },
      ],
    };

    if (params.isActive == 0 || params.isActive == 1) {
      where.status = params.isActive;
    }
    let getUserData = await User.find(where).exec();
    response = {
      status: true,
      userData: getUserData,
    };
  }

  return res.json(response);
};
// To update single user
exports.updateUser = async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    var profilePic = null;
    if (req?.file?.filename) {
      profilePic = url + "/public/" + req.file.filename;
    }
    const { firstname, lastname, email, status } = req.body;

    // Find the user by userId
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        message: "User not found",
        status: false,
        response: [],
      });
    }
    let profilePicture = "";
    if (user.profilePicture != undefined) {
      profilePicture =
        user.profilePicture.split("/")[
          user.profilePicture.split("/").length - 1
        ];
    }
    // Update the user object with the new values
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.profilePicture = profilePic || user.profilePicture;
    user.email = email || user.email;
    user.status = status || user.status;
    // Save the updated user
    await user.save();
    if (
      req.file != undefined &&
      req.file.filename != undefined &&
      profilePicture != ""
    ) {
      try {
        fs.unlinkSync(`public/${profilePicture}`);
      } catch (error) {
        throw "File does not deleted !!! ";
      }
    }

    return res.json({
      message: "User updated successfully",
      status: true,
      response: user,
    });
  } catch (error) {
    return res.json({
      message: "Internal server error",
      status: false,
      response: [],
    });
  }
};
//password Update api
exports.updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by username
    const user = await User.findById(userId);
    // Check if the user exists
    if (!user) {
      return res.json({ message: "User not found.", status: false });
    }
    // Check if the old password matches
    const isPasswordMatch = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.json({ message: "Invalid old password.", status: false });
    }
    const newPassword = bcrypt.hashSync(req.body.password, 8);

    // Update the password
    user.password = newPassword;

    // Save the updated user
    await user.save();
    // Return success response
    return res.json({
      message: "Password changed successfully.",
      status: true,
    });
  } catch (error) {
    res.json({ message: "Error updating password", status: false });
  }
};
