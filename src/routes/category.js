const express = require('express')
const router = express.Router()
const {
  createCategory,
  getCategories,
  updateCategories,
  deleteCategories,
  latestProductsInCategory,
  getSlides,
} = require('../controller/category')
const { requireSignIn } = require('../common-middleware')

router.post('/category/create', requireSignIn, createCategory)
router.get('/category/getCategory', getCategories)
router.post('/category/update', requireSignIn, updateCategories)
router.post('/category/delete', requireSignIn, deleteCategories)
router.get('/category/products', latestProductsInCategory)
router.get('/slide/show', getSlides)

module.exports = router
