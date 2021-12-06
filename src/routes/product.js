const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getProductsBySlug, 
    getProductDetailsById, deleteProductById, getSellerProducts, searchProduct } = require('../controller/product');
const { requireSignIn  } = require('../common-middleware');
const upload = require('../utils/multer');
const path = require('path');

router.post('/product/add', requireSignIn, upload.array('productPicture'), addProduct);
router.get("/product/getSellerProducts",requireSignIn, getSellerProducts);
router.delete("/product/deleteProductById", requireSignIn, deleteProductById);
router.get("/products/:slug", getProductsBySlug);
router.get("/product/getProducts", getProducts);
router.get("/product/:productId", getProductDetailsById);
router.get("/product/:search", searchProduct);

module.exports = router;