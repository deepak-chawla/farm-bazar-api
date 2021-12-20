const slugify = require('slugify')
const Category = require('../models/category')
const shortid = require('shortid')
const Product = require('../models/product')
const homeSlider = require('../models/homeSlider')
const { addStr } = require('../helpers/index')

function arrangeCategories(categories, parentId = null) {
  const categoryList = []
  let category
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined)
  } else {
    category = categories.filter((cat) => cat.parentId == parentId)
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: arrangeCategories(categories, cate._id),
    })
  }

  return categoryList
}

exports.createCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${Date.now()}`,
    createdBy: req.user._id,
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId
  }

  const cat = new Category(categoryObj)
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error })
    if (category) {
      return res.status(201).json({ category })
    }
  })
}

exports.getCategories = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) return res.status(400).json({ error })
    if (categories) {
      const categoryList = arrangeCategories(categories)
      res.status(200).json({ categoryList })
    }
  })
}

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId } = req.body
  const updatedCategories = []
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
      }
      if (parentId[i] !== '') {
        category.parentId = parentId[i]
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      )
      updatedCategories.push(updatedCategory)
    }
    return res.status(201).json({ updateCategories: updatedCategories })
  } else {
    const category = {
      name,
    }
    if (parentId !== '') {
      category.parentId = parentId
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    })
    return res.status(201).json({ updatedCategory })
  }
}

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload
  const deletedCategories = []
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    })
    deletedCategories.push(deleteCategory)
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: 'Categories removed' })
  } else {
    res.status(400).json({ message: 'Something went wrong' })
  }
}

exports.getSlides = async (req, res) => {
  try {
    const slides = await homeSlider.find({})
    res.status(200).json(slides)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.latestProductsInCategory = async (req, res) => {
  try {
    const categories = await Category.find({})
    let response = []
    for (cate of categories) {
      let products = await Product.find({ category: cate._id })
        .sort({ createdAt: 'desc' })
        .select('_id productName productPictures')
        .limit(10)

      products = products.map((product) => {
        let imageUrl
        if (product.productPictures.length > 0) {
          imageUrl = product.productPictures[0].img
        } else {
          imageUrl = product.productPictures.img
        }
        let thumbnail
        if (imageUrl) {
          thumbnail = addStr(imageUrl, 49, 'w_80,h_80,c_fill')
        }
        return {
          productId: product._id,
          productName: product.productName,
          thumbnail: thumbnail ? thumbnail : '',
        }
      })

      response.push({
        categoryId: cate._id,
        categoryName: cate.name,
        products: products,
      })
    }

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
