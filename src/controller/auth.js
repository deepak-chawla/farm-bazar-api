const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { sendMail } = require('../helpers')
const otpGenerator = require('otp-generator')
const jwtDecode = require('jwt-decode')
const path = require('path')
const generateJwtToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_KEY)
}

//======================================SIGN UP==========================================
exports.signup = (req, res) => {
  try {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user) {
          return res.status(400).json({
            status: 'fail',
            message: 'User already registered',
          })
        } else {
          const {
            firstName,
            lastName,
            contactNumber,
            email,
            password,
            gender,
            dateOfBirth,
            city,
            address,
            postalCode,
          } = req.body
          const hash_password = await bcrypt.hash(password, 10)

          const _user = new User({
            firstName,
            lastName,
            contactNumber,
            email,
            hash_password,
            gender,
            dateOfBirth,
            city,
            address,
            postalCode,
          })

          _user
            .save()
            .then((user) => {
              const token = generateJwtToken(user._id, user.email)

              const data = {
                from: `${process.env.USER_EMAIL}`,
                to: `${email}`,
                subject: 'Farm Bazar Email Verification',
                html: `<h1>This is your verification link </h1><a>https://farm-bazar-api.herokuapp.com/api/verify/${token}</a>`,
              }

              sendMail(data)

              return res.status(201).json({
                status: 'success',
                message: 'User Created Please Check Your Email to Verify',
              })
            })
            .catch((error) => {
              res.status(400).json({
                status: 'fail',
                message: error.message,
              })
            })
        }
      })
      .catch((error) =>
        res.status(400).json({ status: 'fail', message: error.message })
      )
  } catch (error) {
    console.log(error.message)
  }
}

//==============================EMAIL VERIFY===================================================
exports.verifyEmail = async (req, res) => {
  const { token } = req.params
  const decoded = jwtDecode(token)

  const user = await User.findOne({ email: decoded.email })

  if (user) {
    user.isActive = true
    user.save()
    res.status(200).sendFile(path.join(__dirname + '/verifyMsg.html'))
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'User Not Found',
    })
  }
}

//==========================================RESEND LINK==============================================
exports.reSendVerifyLink = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      const token = generateJwtToken(user._id, user.email)

      const data = {
        from: `${process.env.USER_EMAIL}`,
        to: `${user.email}`,
        subject: 'Farm Bazar Email Verification',
        html: `<h1>This is your verification link </h1><a>https://farm-bazar-api.herokuapp.com/api/verify/${token}</a>`,
      }

      sendMail(data)

      return res.status(200).json({
        status: 'success',
        message: 'Please check your email for verification link',
      })
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'This email is not found in our record, Please register',
      })
    }
  })
}

//==================================FORGET PASSWORD======================================
exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const password = otpGenerator.generate(10, {
        specialChars: true,
        alphabets: true,
      })
      const hash_password = await bcrypt.hash(password, 10)
      user.hash_password = hash_password
      await user.save()
      const data = {
        from: `${process.env.USER_EMAIL}`,
        to: `${user.email}`,
        subject: 'Password Reset',
        html: `<h1>Your New Password is:</h1><h3>${password}</h3>`,
      }

      sendMail(data)
      return res.status(200).json({
        status: 'success',
        message: 'Please check your email for credentials',
      })
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'This email is not found in our record, Please register',
      })
    }
  } catch (error) {
    res.status(200).json({ status: 'fail', message: error.message })
  }
}

//=======================================SIGN IN===================================================
exports.signin = async (req, res) => {
  try {
    User.findOne({ email: req.body.email })
      .then(async (user) => {
        if (user) {
          if (user.isActive) {
            const isPassword = await user.authenticate(req.body.password)
            if (isPassword) {
              const token = generateJwtToken(user._id, user.email)
              const {
                _id,
                isSeller,
                fullName,
                email,
                contactNumber,
                gender,
                dateOfBirth,
                city,
                address,
                postalCode,
                profilePicture,
              } = user

              res.status(200).json({
                status: 'success',
                message: 'User Successfully Logged In',
                token,
                user: {
                  _id,
                  isSeller,
                  fullName,
                  email,
                  contactNumber,
                  gender,
                  dateOfBirth,
                  city,
                  address,
                  postalCode,
                  profilePicture,
                },
              })
            } else {
              return res.status(400).json({
                status: 'fail',
                message: 'Password Incorrect',
              })
            }
          } else {
            return res.status(400).json({
              status: 'success',
              message: 'Please Activate Your Account',
            })
          }
        } else {
          return res.status(400).json({
            status: 'fail',
            message: 'User Not Found',
          })
        }
      })
      .catch((error) =>
        res.status(400).json({ status: 'fail', message: error.message })
      )
  } catch (error) {
    console.log(error.message)
  }
}
