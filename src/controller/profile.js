const User = require('../models/user')
const bcrypt = require('bcrypt')
const path = require('path')
const cloudinary = require('../utils/cloudinary')

exports.updateUser = async (req, res) => {
  User.findById({ _id: req.user._id })
    .select('-hash_password')
    .then((user) => {
      user.firstName = req.body.firstName || user.firstName
      user.lastName = req.body.lastName || user.lastName
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth
      user.gender = req.body.gender || user.gender
      user.postalCode = req.body.postalCode || user.userImgUrl
      user.address = req.body.address || user.address
      user.city = req.body.city || user.city
      user.province = req.body.province || user.province
      user
        .save()
        .then((user) => {
          res.status(200).json({
            status: 'success',
            message: 'User successfully Updated',
            user: user,
          })
        })
        .catch((error) =>
          res.status(400).json({ status: 'fail', message: error.message })
        )
    })
    .catch((error) =>
      res.status(400).json({ status: 'fail', message: error.message })
    )
}

exports.userInfo = async (req, res) => {
  User.findById({ _id: req.user._id })
    .then((usr) => {
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
      }
      res.status(200).json(user)
    })
    .catch((error) =>
      res.status(400).json({ status: 'fail', message: error.message })
    )
}

exports.profile = async (req, res) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      res.status(200).json({
        isSeller: user.isSeller,
        fullName: user.fullName,
        userImgUrl: user.profilePicture,
      })
    })
    .catch((error) => {
      res.status(404).json({ status: 'fail', message: error.message })
    })
}

exports.updateUserPhoto = async (req, res) => {
  if (req.file) {
    User.findById(req.user._id)
      .then(async (user) => {
        if (user.cloudinary_id) {
          await cloudinary.uploader.destroy(user.cloudinary_id)
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          quality: 'auto',
          folder: 'users/',
        })
        user.profilePicture = result.secure_url
        user.cloudinary_id = result.public_id
        user.save((err, url) => {
          if (err) {
            res.status(400).json({ status: 'fail', message: err.message })
          } else {
            res
              .status(200)
              .json({ status: 'success', profilePicture: url.profilePicture })
          }
        })
      })
      .catch()
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    const isPassword = await user.authenticate(oldPassword)
    if (isPassword) {
      const hash_password = await bcrypt.hash(newPassword, 10)
      user.hash_password = hash_password
      await user.save((err, save) => {
        if (!err) {
          res.status(200).json({
            status: 'success',
            message: 'Password Successfully Chnaged',
          })
        }
      })
    } else {
      res.status(400).json({ status: 'fail', message: 'Wrong Password' })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
