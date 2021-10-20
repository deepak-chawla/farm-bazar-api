const User = require('../models/user');
const fs = require("fs");
const path = require('path');

exports.updateUser = async (req, res) => {
  User.findById({ _id: req.user._id })
  .then(user => {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    user.postalCode = req.body.postalCode || user.userImgUrl;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.province = req.body.province || user.province;
    user.save()
    .then(user => {
      res.status(200).json({
        status: "success",
        message: "User successfully Updated"
      });
    }).catch(error => res.status(400).json({status: 'fail', message: error.message}))
  }).catch(error => res.status(400).json({status: 'fail', message: error.message}));
}


exports.userInfo = async (req, res) => {
  User.findById({ _id: req.user._id })
  .then(usr => {
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
  }).catch(error => res.status(400).json({status: 'fail', message: error.message}));
}

exports.profile = async (req, res) => {
  User.findById({ _id: req.user._id })
  .then(user => {
    res.status(200).json({ isSeller: user.isSeller, fullName: user.fullName, userImgUrl: user.profilePicture });
  })
  .catch(error => {
    res.status(404).json({ status: "fail", message: error.message });
  });
}


exports.updateUserPhoto = async (req, res) => {
  if (req.file) {
    User.findById(req.user._id)
      .then(user => {
        const imageUrl = `${req.headers.host}/uploads/${req.file.filename}`;
        if (user.profilePicture.length) {
          let profilePicture = user.profilePicture.substring(user.profilePicture.search('uploads/'), user.profilePicture.length).substring(8,user.profilePicture.length);
          fs.unlinkSync(path.join(path.dirname(__dirname), `../public/upload/${profilePicture}`));
        }
        user.profilePicture = imageUrl;
        user.save()
          .then(result => res.status(200).json({ status: 'success', message: 'profile updated', userImgUrl: result.profilePicture }))
          .catch(error => res.status(400).json({ status: 'fail', message: error.message }))
      }
      ).catch(error => res.status(400).json({ status: 'fail', message: error.message }));
  } else {
    res.status(400).json({ status: 'fail', message: 'image File Required' });
  }
}