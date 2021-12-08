const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getProductsBySlug, 
    getProductDetailsById, deleteProductById, getSellerProducts, 
    searchProduct, getProductByStatus, getProductByStoreId } = require('../controller/product');
const { requireSignIn  } = require('../common-middleware');
const upload = require('../utils/multer');
const path = require('path');

router.post('/product/add', requireSignIn, upload.array('productPicture'), addProduct);
router.get("/product/getSellerProducts",requireSignIn, getSellerProducts);
router.delete("/product/deleteProductById", requireSignIn, deleteProductById);
router.get("/product/getProductByStatus/", getProductByStatus);
router.get("/product/getProductByStoreId/", getProductByStoreId);
router.get("/product/getProducts", getProducts);
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.get("/product/", searchProduct);

module.exports = router;