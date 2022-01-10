const express = require('express')
const router = express.Router()
const {
  signup,
  signin,
  verifyEmail,
  reSendVerifyLink,
  forgetPassword,
  getAllUsers,
} = require('../controller/auth')
const {
  isValidateSignUp,
  isValidateSignIn,
  validateErrors,
} = require('../validator/auth')

router.post('/register', isValidateSignUp, validateErrors, signup)
router.post('/login', isValidateSignIn, validateErrors, signin)
router.get('/verify/:token', verifyEmail)
router.post('/resend-email', reSendVerifyLink)
router.post('/forget-password', forgetPassword)
router.get('/users', getAllUsers)

module.exports = router
