const { check, validationResult } = require('express-validator');

exports.isValidateSignUp = [
    check('firstName').notEmpty().withMessage("First Name is Required"),
    check('lastName').notEmpty().withMessage("Last Name is Required"),
    check('email').isEmail().withMessage("Valid Email is Required"),
    check('password').isLength({min: 5}).withMessage("Password must be atleat 5 character long")
];


exports.isValidateSignIn = [
    check('email').isEmail().withMessage("Valid Email is Required"),
    check('password').isLength({min: 5}).withMessage("Password must be atleat 5 character long")
];

exports.validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: "Fail", message: errors.array()[0].msg });
    }
    next()
}