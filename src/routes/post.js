const router = require('express').Router()
const { requireSignIn } = require('../common-middleware')
const upload = require('../utils/multer')
const {
  addPost,
  deletePost,
  editPost,
  getPostById,
  getAllPosts,
  getMyPosts,
  searchPost,
} = require('../controller/post')

router.post('/post/add', requireSignIn, upload.single('image'), addPost)
router.delete('/post/delete/:postId', requireSignIn, deletePost)
router.post(
  '/post/edit/:postId',
  requireSignIn,
  upload.single('image'),
  editPost
)
router.get('/post/get/:postId', getPostById)
router.get('/post/getAllPosts', getAllPosts)
router.get('/post/myPosts', requireSignIn, getMyPosts)
router.get('/post/search', searchPost)
module.exports = router
