const router = require("express").Router();
const { requireSignIn  } = require('../common-middleware');
const { addOrder, getStoreOrdersByStatus, changeOrderStatusById } = require('../controller/order');


router.post("/order/add/:productId", requireSignIn, addOrder);
router.get('/order/getStoreOrdersByStatus', requireSignIn, getStoreOrdersByStatus);
router.post('/order/changeOrderStatusById', requireSignIn, changeOrderStatusById);

module.exports = router;