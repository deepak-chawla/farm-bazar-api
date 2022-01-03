const Post = require('../models/post')
const cloudinary = require('../utils/cloudinary')
const { addStr } = require('../helpers')

exports.addPost = async (req, res) => {
  try {
    const { title, description } = req.body
    const image = req.file.path
    const result = await cloudinary.uploader.upload(image, {
      quality: 'auto',
      folder: 'posts/',
    })
    const _newPost = new Post({
      title,
      description,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      createdBy: req.user._id,
    })

    _newPost.save((err, saved) => {
      if (!err) {
        res
          .status(200)
          .json({ status: 'success', message: `${saved.title} Post Added.` })
      }
    })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)
    if (post.createdBy == req.user._id) {
      await cloudinary.uploader.destroy(post.cloudinary_id)
      post.remove((err, del) => {
        console.log(del)
        if (!err) {
          res.status(200).json({ status: 'success', message: 'Post Removed' })
        }
      })
    } else {
      res
        .status(400)
        .json({ status: 'fail', message: "Post doesn't related to you " })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.editPost = async (req, res) => {
  try {
    const { postId } = req.params
    const { title, description } = req.body
    const post = await Post.findById(postId)
    if (post.createdBy == req.user._id) {
      if (req.file) {
        const image = req.file.path
        const result = await cloudinary.uploader.upload(image, {
          quality: 'auto',
          folder: 'posts/',
        })
        await cloudinary.uploader.destroy(post.cloudinary_id)
        post.image = result.secure_url
        post.cloudinary_id = result.public_id
      }
      post.title = title || post.title
      post.description = description || post.description
      post.save((err, saved) => {
        if (!err) {
          res.status(200).json({
            status: 'success',
            message: `${saved.title} has been Edited.`,
          })
        }
      })
    } else {
      res
        .status(400)
        .json({ status: 'fail', message: "Post doesn't related to you " })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId).populate(
      'createdBy',
      'firstName lastName'
    )
    if (post === null) {
      res.status(400).json({ status: 'fail', message: 'Post does not Exist.' })
    } else {
      res.status(200).json(post)
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find({})
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: 'desc' })
    posts = posts.map((post) => {
      return {
        ...post._doc,
        image: addStr(post.image, 49, 'w_80,h_80,c_fill'),
      }
    })
    res.status(200).json({ posts: posts })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getMyPosts = async (req, res) => {
  try {
    let posts = await Post.find({ createdBy: req.user._id })
      .populate('createdBy', 'firstName lastName')
      .sort({
        createdAt: 'desc',
      })
    posts = posts.map((post) => {
      return {
        ...post._doc,
        image: addStr(post.image, 49, 'w_80,h_80,c_fill'),
      }
    })
    res.status(200).json({ posts: posts })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.searchPost = async (req, res) => {
  try {
    let { query } = req.query
    const regex = RegExp(query, 'i')
    let posts = await Post.find({ title: regex }).populate(
      'createdBy',
      'firstName lastName'
    )
    posts = posts.map((post) => {
      return {
        ...post._doc,
        image: addStr(post.image, 49, 'w_80,h_80,c_fill'),
      }
    })
    res.status(200).json({ posts: posts })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
