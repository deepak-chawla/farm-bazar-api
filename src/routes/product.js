const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getProductsBySlug, getProductDetailsById, deleteProductById, getSellerProducts } = require('../controller/product');
const { requireSignIn  } = require('../common-middleware');
const path = require('path');
const shortid = require('shortid');

const multer = require('multer');   

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate()+ '-' + file.originalname)
    }
})
   
const upload = multer({ storage: storage });

router.post('/product/add', requireSignIn, upload.array('productPicture'), addProduct);
router.post("/product/getSellerProducts",requireSignIn, getSellerProducts);
router.delete("/product/deleteProductById", requireSignIn, deleteProductById);
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.post("/product/getProducts", getProducts);

module.exports = router;