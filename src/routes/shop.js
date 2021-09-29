const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../common-middleware');
const { createStore } = require('../controller/shop');


router.post('/create-store', requireSignIn, createStore);


module.exports = router;