const slugify = require('slugify')
const product = require('../models/product')
const Product = require('../models/product')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')

exports.addProduct = async (req, res) => {
  const {
    productName,
    price,
    description,
    category,
    unit,
    quantity,
    location,
  } = req.body
  let productPictures = []

  if (req.files.length > 0) {
    for (const file of req.files) {
      await cloudinary.uploader
        .upload(file.path, { folder: 'products/' })
        .then((result) => {
          productPictures.push({
            img: result.secure_url,
            cloudinary_id: result.public_id,
          })
        })
        .catch((err) => res.status(400).json(err.message))
    }
  }

  try {
    const user = await User.findById({ _id: req.user._id })
    const product = new Product({
      productName,
      slug: `${productName} - ${Date.now()}`,
      price,
      quantity,
      unit,
      description,
      productPictures,
      category,
      location,
      createdBy: req.user._id,
      storeId: user.storeId,
    })

    product
      .save()
      .then((product) => {
        res.status(201).json({
          status: 'success',
          message: `${product.productName} Product Added Successfully`,
        })
      })
      .catch((error) =>
        res.status(400).json({ status: 'fail', message: error.message })
      )
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params
  Category.findOne({ slug: slug })
    .select('_id type')
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error })
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error })
          } else {
            res.status(200).json({ products })
          }
        })
      }
    })
}

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params
  if (productId) {
    Product.findOne({ _id: productId })
      .select(
        'productName price quantity unit description category location productPictures'
      )
      .populate('category', 'name')
      .populate('storeId', 'storeName')
      .exec((error, product) => {
        if (error) return res.status(400).json({ error })
        if (product) {
          res.status(200).json({
            productId: product._id,
            productName: product.productName,
            productPrice: product.price,
            productQuantity: product.quantity,
            productUnit: product.unit,
            productDescription: product.description,
            productLocation: product.location,
            productCategory: product.category,
            productDeliveryCharges: 200,
            productRating: 3.5,
            productPictures: product.productPictures,
            store: product.storeId,
          })
        }
      })
  } else {
    return res.status(400).json({ error: 'Params required' })
  }
}

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error })
      if (result) {
        res.status(202).json({ result })
      }
    })
  } else {
    res.status(400).json({ error: 'Params required' })
  }
}

exports.getProducts = async (req, res) => {
  let { page, size } = req.query
  if (!page) {
    page = 1
  }
  if (!size) {
    size = 10
  }
  const limit = parseInt(size)
  const skip = (page - 1) * size

  Product.find()
    .limit(limit)
    .skip(skip)
    .then((products) => res.status(200).json({ products: products }))
    .catch((err) =>
      res.status(400).json({ status: 'fail', message: err.message })
    )
}

exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select('_id name price quantity description productPictures category')
    .populate({ path: 'category', select: '_id name' })
    .exec()

  res.status(200).json({ products })
}

exports.getProductByStoreId = async (req, res) => {
  let { page, size, storeId } = req.query
  if (!page) {
    page = 1
  }
  if (!size) {
    size = 10
  }
  const limit = parseInt(size)
  const skip = (page - 1) * size

  await Product.find({ $and: [{ storeId: storeId }, { isActive: true }] })
    .select(
      'isActive _id productName price quantity unit description productPictures category location  storeId'
    )
    .limit(limit)
    .skip(skip)
    .then((products) => {
      res.status(200).json(products)
    })
    .catch((err) =>
      res.status(400).json({ status: 'fail', message: err.message })
    )
}

exports.getProductByStatus = async (req, res) => {
  let { page, size, isActive } = req.query
  if (!page) {
    page = 1
  }
  if (!size) {
    size = 10
  }
  const limit = parseInt(size)
  const skip = (page - 1) * size

  await Product.find({ isActive: isActive })
    .limit(limit)
    .skip(skip)
    .then((products) => {
      if (products.length > 0) {
        res.status(200).json({ products: products })
      } else {
        res.status(200).json({ message: 'Product not available.' })
      }
    })
    .catch((err) =>
      res.status(200).json({ status: 'fail', message: err.message })
    )
}

exports.searchProduct = async (req, res) => {
  try {
    let { page, size, query, category, location } = req.query
    if (!page) {
      page = 1
    }
    if (!size) {
      size = 10
    }
    const limit = parseInt(size)
    const skip = (page - 1) * size

    const regex = RegExp(query, 'i')
    await Product.find({
      $and: [
        category ? { category: category } : {},
        location ? { location: location } : {},
        { productName: regex },
        { isActive: true },
      ],
    })
      .select(
        '_id productName category unit price quantity location productPictures'
      )
      .populate('category', 'name -_id')
      .limit(limit)
      .skip(skip)
      .then((products) => {
        let response = products.map((product) => {
          let productPicture
          if (product.productPictures.length > 0) {
            productPicture = product.productPictures[0].img
          } else {
            productPicture = ''
          }
          return {
            productId: product._id,
            productName: product.productName,
            productPicture: productPicture,
            productPrice: product.price,
            productQuantity: product.quantity,
            productUnit: product.unit,
            productCategory: product.category.name,
            productLocation: product.location,
          }
        })

        res
          .status(200)
          .json(products.length > 0 ? { products: response } : 'Not Available')
      })
      .catch((err) =>
        res.status(200).json({ status: 'fail', message: err.message })
      )
  } catch (error) {
    res.status(200).json({ status: 'fail', message: error.message })
  }
}
