const express = require('express')
const router = express.Router()
const {
  addProduct,
  getProducts,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getStoreProducts,
  searchProduct,
  getProductByStatus,
  getProductByStoreId,
  changeProductStatusById,
  rateProduct,
  editProduct,
} = require('../controller/product')
const { requireSignIn } = require('../common-middleware')
const upload = require('../utils/multer')
const path = require('path')

router.post(
  '/product/add',
  requireSignIn,
  upload.array('productPicture'),
  addProduct
)
router.get('/product/getStoreProducts', requireSignIn, getStoreProducts)
router.delete('/product/delete/:productId', requireSignIn, deleteProductById)
router.post(
  '/product/changeProductStatusById',
  requireSignIn,
  changeProductStatusById
)
router.get('/product/getProductByStatus/', getProductByStatus)
router.get('/product/getProductByStoreId/', getProductByStoreId)
router.get('/product/getProducts', getProducts)
router.post('/product/edit/:productId', editProduct)
router.get('/product/get/:productId', getProductDetailsById)
router.get('/product/', searchProduct)
router.put('/product/rating', requireSignIn, rateProduct)

module.exports = router
