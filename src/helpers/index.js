const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASS}`
  }
});


exports.sendMail = (data) => {
        
    transporter.sendMail(data, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

}