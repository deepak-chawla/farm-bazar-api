const router = require("express").Router();
const { requireSignIn  } = require('../common-middleware');
const { addOrder } = require('../controller/order');


router.get("/order/:productId", requireSignIn, addOrder);

module.exports = router;