const express = require('express')
const router = express.Router()
const upload = require('../utils/multer')
const { requireSignIn } = require('../common-middleware')
const {
  createStore,
  getStoreById,
  getOwnerById,
  editStore,
  changeStorePhoto,
  getStore,
  changeDeliveryOutCity,
} = require('../controller/shop')

router.post('/create-store', requireSignIn, createStore)
router.get('/store', requireSignIn, getStore)
router.post('/store/edit', requireSignIn, editStore)
router.post(
  '/store/changeStorePhoto',
  requireSignIn,
  upload.single('storeImage'),
  changeStorePhoto
)
router.post('/store/deliveryOutCity', requireSignIn, changeDeliveryOutCity)
router.get('/store/get/:storeId', getStoreById)
router.get('/owner/get/:ownerId', getOwnerById)

module.exports = router
