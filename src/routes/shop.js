const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../common-middleware');
const { createShop } = require('../controller/shop');


router.post('/create-shop', requireSignIn, createShop);


module.exports = router;