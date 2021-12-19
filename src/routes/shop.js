const express = require('express')
const router = express.Router()
const { requireSignIn } = require('../common-middleware')
const {
  createStore,
  getStoreById,
  getOwnerById,
} = require('../controller/shop')

router.post('/create-store', requireSignIn, createStore)
router.get('/store/get/:storeId', getStoreById)
router.get('/owner/get/:ownerId', getOwnerById)
module.exports = router
