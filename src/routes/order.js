const router = require('express').Router()
const { requireSignIn } = require('../common-middleware')
const {
  addOrder,
  getStoreOrders,
  changeOrderStatusById,
  getBuyerOrders,
  getOrderById,
} = require('../controller/order')

router.post('/order/add/:productId', requireSignIn, addOrder)
router.get('/store/order/getStoreOrders', requireSignIn, getStoreOrders)
router.post(
  '/store/order/changeOrderStatusById',
  requireSignIn,
  changeOrderStatusById
)
router.get('/buyer/order/getBuyerOrders', requireSignIn, getBuyerOrders)
router.get('/order/get/:orderId', getOrderById)

module.exports = router
