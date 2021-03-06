const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const cloudinary = require('../utils/cloudinary')
const { addStr } = require('../helpers')

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

exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const {
      productName,
      price,
      description,
      category,
      unit,
      quantity,
      location,
    } = req.body
    const product = await Product.findById(productId)
    product.productName = productName || product.productName
    product.price = price || product.price
    product.description = description || product.description
    product.category = category || product.category
    product.unit = unit || product.unit
    product.quantity = quantity || product.quantity
    product.save((err, save) => {
      if (err) {
        res.status(400).json({ status: 'fail', message: err.message })
      } else {
        res
          .status(200)
          .json({ status: 'success', message: 'Product successfully Edited' })
      }
    })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params
  if (productId) {
    Product.findById({ _id: productId })
      .select(
        'isActive productName price quantity unit description category location productPictures createdBy'
      )
      .populate('category', 'name')
      .populate('storeId', 'storeName storeImage')
      .exec((error, product) => {
        if (error)
          return res
            .status(400)
            .json({ status: 'fail', message: error.message })
        if (product) {
          res.status(200).json({
            isActive: product.isActive,
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
            sellerId: product.createdBy,
          })
        }
      })
  } else {
    return res.status(400).json({ error: 'Params required' })
  }
}

exports.deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params
    await Product.deleteOne({
      _id: productId,
    })
      .then((deletedProduct) =>
        res
          .status(200)
          .json({ status: 'success', message: 'product has been deleted' })
      )
      .catch((err) =>
        res.status(400).json({ status: 'fail', message: err.message })
      )
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
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

exports.getStoreProducts = async (req, res) => {
  try {
    const { isActive } = req.query
    const products = await Product.find({
      $and: [{ isActive: isActive }, { createdBy: req.user._id }],
    })
      .sort({ updatedAt: 'desc' })
      .select(
        '_id isActive productName price quantity unit description productPictures category'
      )
      .populate({ path: 'category', select: '_id name' })

    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.changeProductStatusById = async (req, res) => {
  try {
    const { isActive, productId } = req.query
    const order = await Order.findOne({ productId: productId })
    const product = await Product.findById({ _id: productId })
    if (product.createdBy == req.user._id) {
      if (isActive == 'false') {
        if (order) {
          if (!order.isActive) {
            product.isActive = isActive
            product.save((err, saved) => {
              if (!err) {
                res.status(200).json({
                  status: 'success',
                  message: `Product Status Changed to Discontinued`,
                })
              }
            })
          } else {
            res.status(200).json({
              status: 'fail',
              message: `Product has Active Order, Couldn't Discontinue`,
            })
          }
        } else {
          product.isActive = isActive
          product.save((err, saved) => {
            if (!err) {
              res.status(200).json({
                status: 'success',
                message: `Product Status Changed to Discontinued`,
              })
            }
          })
        }
      } else {
        product.isActive = isActive
        product.save((err, saved) => {
          if (!err) {
            res.status(200).json({
              status: 'success',
              message: `Product Status Changed to Active`,
            })
          }
        })
      }
    } else {
      res
        .status(400)
        .json({ status: 'fail', message: 'product does not match with user' })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
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
      res.status(200).json({ products: products })
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
    location = RegExp(location, 'i')
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
            productPicture = addStr(
              product.productPictures[0].img,
              49,
              'w_100,h_100,c_fill'
            )
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
          .json(products.length > 0 ? { products: response } : { products: [] })
      })
      .catch((err) =>
        res.status(400).json({ status: 'fail', message: err.message })
      )
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.rateProduct = async (req, res) => {
  try {
    const { productId, rating } = req.query
    if (productId && rating) {
      let userExist = false
      const product = await Product.findById({ _id: productId })
      console.log(product)
      for (rate of product.ratings) {
        if (rate.userId == req.user._id) {
          userExist = true
        }
      }
      if (!userExist) {
        product.ratings.push({
          userId: req.user._id,
          rating: rating,
        })
        product.save((err, saved) => {
          if (!err) {
            res.status(200).json({
              status: 'success',
              message: 'Thank You for Rating our Product',
            })
          }
        })
      } else {
        res.status(400).json({
          status: 'fail',
          message: 'You already rated this product',
        })
      }
    } else {
      res.status(400).json({ status: 'fail', message: 'queries required' })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
