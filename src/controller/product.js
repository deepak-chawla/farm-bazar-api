const slugify = require('slugify');
const product = require('../models/product');
const Product = require("../models/product");
const User = require('../models/user');
const cloudinary = require('../utils/cloudinary');

exports.addProduct = async (req, res) => {
  const { name, price, description, category, unit, quantity } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    for (const file of req.files) {
      await cloudinary.uploader.upload(file.path, { folder: "products/" },)
        .then(result => {
          productPictures.push({
            img: result.secure_url,
            cloudinary_id: result.public_id
          })
        })
        .catch(err => res.status(400).json(err.message))
    }
  }

  try {
    const user = await User.findById({ _id: req.user._id });
    const product = new Product({
      name,
      slug: `${name} - ${Date.now()}`,
      price,
      quantity,
      unit,
      description,
      productPictures,
      category,
      createdBy: req.user._id,
      storeId: user.storeId,
    });

    product.save()
      .then(product => {
        res.status(201).json({
          product
        });
      }
      ).catch(error => res.status(400).json({ status: 'fail', message: error.message }));
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
}

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};


exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  Product.find()
    .limit(limit).skip(skip)
    .then(products => res.status(200).json({ products: products }))
    .catch(err => res.status(400).json({ status: 'fail', message: err.message }));
};

exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};

exports.getProductByStoreId = async (req, res) => {

  let { page, size, storeId } = req.query;
  if (!page) { page = 1; }
  if (!size) { size = 10; }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  await Product.find({ storeId: storeId })
    .limit(limit).skip(skip)
    .then(products => {
      res.status(200).json({ products: products });
    })
    .catch(err => res.status(400).json({ status: 'fail', message: err.message }));

}

exports.getProductByStatus = async (req, res) => {
  let { page, size, isActive } = req.query;
  if (!page) { page = 1; }
  if (!size) { size = 10; }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  await Product.find({ isActive: isActive })
    .limit(limit).skip(skip)
    .then(products => {
      if (products.length > 0) {
        res.status(200).json({ products: products });
      }
      else {
        res.status(200).json({ message: "Product not available." });
      }
    }).catch(err => res.status(200).json({ status: 'fail', message: err.message }));
}


exports.searchProduct = async (req, res) => {

  let { page, size, search, category } = req.query;
  if (!page) { page = 1; }
  if (!size) { size = 10; }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  const regex = RegExp(search, 'i');

  let products = await Product
    .find({
      $and: [
        { category: category || true },
        { name: regex }
      ]
    })
    .populate('category', 'name')
    .populate("createdBy", "city firstName -_id")
    .limit(limit).skip(skip);

  res.status(200).json(products.length > 0 ? { products: products } : "Not Available")
}