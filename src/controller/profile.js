const User = require('../models/user');
const cloudinary = require("../utils/cloudinary");
const path = require('path');

exports.editProfile = async (req, res) => {
  let result = [];
  console.log(req.user._id)
  const user = await User.findById({ _id: req.user._id });
  if (user) {
    if(req.file){
      result = await cloudinary.uploader.upload(req.file.path);
      cloudinary.uploader.destroy(user.cloudinaryId);
     }
    user.firstName  = req.body.firstName || user.firstName;
    user.lastName  = req.body.lastName || user.lastName;
    user.address = req.body.address || user.address;
    user.contactNumber = req.body.contactNumber || user.contactNumber;
    user.profilePicture = result.secure_url || user.profilePicture;
    user.cloudinaryId = result.public_id || user.cloudinaryId;
    user.save((err, user)=>{
      if (err) return res.status(400).json(err);
      else return res.status(200).json(user);
    })
  }
}


exports.profile = async (req, res) => {
  User.findById({_id: req.user._id},(err,user)=>{
    if(err){
      res.status(400).json(err);
    }
    else{
     res.status(200).json(user);   
    }
  })
}