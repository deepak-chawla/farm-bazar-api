const express = require('express');
const router = express.Router();
const { addToCart } = require('../controller/cart');
const { requireSignIn } = require('../common-middleware');

router.post('/cart/add-to-cart', requireSignIn, addToCart);

module.exports = router;