const User = require('../models/user');
const fs = require("fs");
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
  User.findById({ _id: req.user._id })
  .then(user => {
    const imageUrl = `${req.headers.host}/uploads/${user.profilePicture}`;
    res.status(200).json({ isSeller: user.isSeller, fullName: user.fullName, userImgUrl: imageUrl });
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
          fs.unlinkSync(path.join(path.dirname(__dirname), `../public/upload/${user.profilePicture}`));
        }
        user.profilePicture = req.file.filename;
        user.save()
          .then(result => res.status(200).json({ status: 'success', message: 'profile updated', imageUrl: imageUrl }))
          .catch(error => res.status(400).json({ status: 'fail', message: error.message }))
      }
      ).catch(error => res.status(400).json({ status: 'fail', message: error.message }));
  } else {
    res.status(400).json({ status: 'fail', message: 'image File Required' });
  }
}