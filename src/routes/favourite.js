const express = require('express')
const { requireSignIn } = require('../common-middleware')
const router = express.Router()
const { addToFav, userFav, deleteFav } = require('../controller/favourite')

router.post('/product/addToFav/:productId', requireSignIn, addToFav)
router.get('/product/favourite', requireSignIn, userFav)
router.delete('/product/deleteFav/:productId', requireSignIn, deleteFav)

module.exports = router
