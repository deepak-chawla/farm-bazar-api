const express = require('express')
const router = express.Router()
const { requireSignIn } = require('../common-middleware')
const { adminSignUp, adminSignIn } = require('../controller/admin')
const { getAllOrders } = require('../controller/auth')
const { addSlide } = require('../controller/homeSlider')
const upload = require('../utils/multer')

router.post('/adminSignUp', adminSignUp)
router.post('/adminSignIn', adminSignIn)
router.get('/getAllOrders', getAllOrders)
router.post('/slide/add', upload.single('slide'), addSlide)

module.exports = router
