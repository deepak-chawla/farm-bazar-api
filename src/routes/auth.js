const express = require('express');
const router = express.Router();
const { signup, signin, verifyEmail, reSendVerifyLink } = require('../controller/auth');
const { isValidateSignUp, isValidateSignIn, validateErrors } = require('../validator/auth');

router.post('/signup', isValidateSignUp, validateErrors, signup);
router.post('/signin', isValidateSignIn, validateErrors, signin);
router.get('/verify/:token',verifyEmail);
router.post('/resend-email', reSendVerifyLink);

module.exports = router;