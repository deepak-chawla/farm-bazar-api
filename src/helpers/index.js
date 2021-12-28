const nodemailer = require('nodemailer')
const FCM = require('fcm-node')
const serverKey = `${process.env.FCM_SERVER_KEY}`
const fcm = new FCM(serverKey)

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

exports.notifyUser = (token, notification, data) => {
  if (token) {
    let message = {
      to: token,
      notification: notification,
      data: data,
    }

    fcm.send(message, function (err, response) {
      if (err) {
        console.log('Something has gone wrong!' + err)
        console.log('Respponse:! ' + response)
      } else {
        console.log('Successfully sent with response: ', response)
      }
    })
  }
}
