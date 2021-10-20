const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../common-middleware');
const { adminSignUp, adminSignIn } = require('../controller/admin');


router.post('/adminSignUp',  adminSignUp);
router.post('/adminSignIn',  adminSignIn);

module.exports = router;