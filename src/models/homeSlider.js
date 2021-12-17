const mongoose = require('mongoose')

const homeSliderSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    slideImage: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Homeslider', homeSliderSchema)
