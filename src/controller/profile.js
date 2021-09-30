const User = require('../models/user');
const cloudinary = require("../utils/cloudinary");
const path = require('path');

exports.updateUser = async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  if (user) {

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    user.postalCode = req.body.postalCode || user.userImgUrl;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.province = req.body.province || user.province;

    user.save((err, user) => {
      if (err) return res.status(400).json(err);
      else return res.status(200).json({
        status: "success",
        message: "User successfully Updated"
      });
    })
  }
}


exports.userInfo = async (req, res) => {
  User.findById({ _id: req.user._id }, (err, usr) => {
    if (err) {
      res.status(400).json(err);
    }
    else {
      const user = {
        firstName: usr.firstName,
        lastName: usr.lastName,
        fullName: usr.fullName,
        email: usr.email,
        contactNumber: usr.contactNumber,
        dateOfBirth: usr.dateOfBirth,
        gender: usr.gender,
        userImgUrl: usr.profilePicture,
        postalCode: usr.postalCode,
        address: usr.address,
        city: usr.city,
        province: usr.province,
      };
      res.status(200).json(user);
    }
  })
}

exports.profile = async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  if (user) {
    res.status(200).json({ status: "success", isSeller: user.isSeller, userImgUrl: user.profilePicture });
  }
  else {
    res.status(404).json({ status: "fail", message: "User not found." });
  }

}


exports.updateUserPhoto = async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  if (user) {
    if (req.file) {
      let result = await cloudinary.uploader.upload(req.file.path);
      cloudinary.uploader.destroy(user.cloudinaryId);
      user.profilePicture = result.secure_url;
      user.cloudinaryId = result.public_id;
      user.save((err, user) => {
        if (err) return res.status(400).json(err);
        else return res.status(200).json({ status: "success", message: "Profile Photo Successfully Updated." });
      });
    } else {
      res.status(400).json({ status: "fail", message: "Image file required" });
    }
  } else {
    res.status(404).json({ status: "fail", message: "Something went wrong." });
  }
}