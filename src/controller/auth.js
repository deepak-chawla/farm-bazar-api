const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { sendMail } = require('../helpers');
const otpGenerator = require('otp-generator');

const generateJwtToken = (_id, email, expireTime) => {
  return jwt.sign({ _id, email }, process.env.JWT_KEY, {
    expiresIn: expireTime || "1h",
  });
};

//======================================SIGN UP==========================================

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        status: 'Fail',
        message: "User already registered",
      });
    } else {
      const { firstName, lastName, contactNumber, email, password, gender, 
        dateOfBirth, province, city, address, postalCode } = req.body;
      const hash_password = await bcrypt.hash(password, 10);

      const _user = new User({
        firstName,
        lastName,
        contactNumber,
        email,
        hash_password,
        gender,
        dateOfBirth,
        province,
        city,
        address,
        postalCode
      });

      _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            status: 'Fail',
            error
          });
        }
        if (user) {
          const token = generateJwtToken(user._id, user.email);

          const data = {
            from: `farmbazar@support.com`,
            to: `${email}`,
            subject: 'Farm Bazar Email Verification',
            html: `<h1>This is your verification link </h1><a>https://farm-bazar-api.herokuapp.com/api/verify/${token}</a>`
          };
          
          sendMail(data);
          
          return res.status(201).json({
            status: 'Success',
            message: 'User Created Please Check Your Email to Verify'
          });
        }
      });
    }
  });
}

//==============================EMAIL VERIFY===================================================

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const decode = jwt.decode(token, process.env.JWT_KEY)
  const user = await User.findOne({ email: decode.email });

  if (user) {
    user.isActive = true;
    user.save();
    res.status(200).json({
      status: 'Success',
      message: "Your account is activated, You can login now"
    })
  } else {
    res.status(400).json({
      status: 'Fail',
      message: 'User Not Found'
    });
  }
}

//==========================================RESEND LINK==============================================

exports.reSendVerifyLink = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      const token = generateJwtToken(user._id, user.email);
      sendMail(user.email, token);

      return res.status(200).json({
        status: 'Success',
        message: 'Please check your email for verification link'
      });
    }
    else {
      return res.status(400).json({
        status: 'Fail',
        message: 'This email is not found in our record, Please register'
      });
    }
  });
}

//==================================FORGET PASSWORD======================================

exports.forgetPassword = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {

      const OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

      user.otp.code = OTP;
      user.save();

      const data = {
        from: `farmbazar@support.com`,
        to: `${user.email}`,
        subject: 'Password Reset',
        html: `<h1>Verification Code is:</h1><h3>${user.otp.code}</h3>`
      };

      console.log(OTP);

      sendMail(data);

      return res.status(200).json({
        status: 'Success',
        message: 'Please check your email for verification code'
      });
    }
    else {
      return res.status(400).json({
        status: 'Fail',
        message: 'This email is not found in our record, Please register'
      });
    }
  });
}

//=====================================VERIFY OTP==================================================

exports.verifyOtp = async (req, res) => {
  const user = await User.findOne({'otp.code': req.body.code});
  if(user){
    user.otp.isRight = true;
  }
}


//=======================================SIGN IN===================================================

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec((error, user) => {
      if (error) {
        res.status(400).json({
          status: 'Fail',
          messege: error
        });
      } else {
        if (user.isActive) {
          const isPassword = user.authenticate(req.body.password);

          if (isPassword) {
            const token = generateJwtToken(user._id, user.email);
            const { _id, fullName, email } = user;

            res.status(200).json({
              token,
              user: { _id, fullName, email }
            });
          }
          else {
            return res.status(400).json({
              status: 'Fail',
              message: "Password Incorrect"
            });
          }

        }
        else {
          return res.status(400).json({
            status: 'Success',
            messege: "Please Activate Your Account"
          });
        }
      }
    });
};