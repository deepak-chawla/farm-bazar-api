const router = require('express').Router()
const { requireSignIn } = require('../common-middleware')
const {
  addOrder,
  getStoreOrdersByStatus,
  changeOrderStatusById,
  getBuyerOrdersByStatus,
} = require('../controller/order')

router.post('/order/add/:productId', requireSignIn, addOrder)
router.get(
  '/store/order/getStoreOrdersByStatus',
  requireSignIn,
  getStoreOrdersByStatus
)
router.post(
  '/store/order/changeOrderStatusById',
  requireSignIn,
  changeOrderStatusById
)
router.get(
  '/buyer/order/getBuyerOrdersByStatus',
  requireSignIn,
  getBuyerOrdersByStatus
)

module.exports = router
