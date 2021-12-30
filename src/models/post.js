const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
