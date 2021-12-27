const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASS}`,
  },
})

exports.sendMail = (data) => {
  transporter.sendMail(data, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

exports.addStr = (str, index, stringToAdd) => {
  let str1 = str.substring(0, index - 1)
  let endStr = str.substring(index, str.length)
  let str2 = endStr.substring(endStr.indexOf('/'), endStr.length)
  return str1 + stringToAdd + str2
}
