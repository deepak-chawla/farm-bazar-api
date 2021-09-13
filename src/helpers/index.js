const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASS}`
  }
});


exports.sendMail = ( email, token ) => {
      
  const mailOptions = {
      from: `farmbazar@support.com`,
      to: `${email}`,
      subject: 'Farm Bazar Email Verification',
      html: `<h1>This is your verification link </h1><a>http://localhost:3000/auth/verify/${token}</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

}