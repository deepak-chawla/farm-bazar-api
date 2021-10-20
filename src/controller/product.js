const slugify = require('slugify');
const Product = require("../models/product");
const User = require('../models/user');

exports.addProduct = async (req, res) => {
  const { name, price, description, category, unit, quantity } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  try {
    const user = await User.findById({ _id: req.user._id });
    const product = new Product({
      name: name,
      slug: slugify(name),
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
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({ products });
};

exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
