const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    aboutStore: {
      type: String,
    },
    storeImage: {
      type: String,
      default:
        'https://res.cloudinary.com/deetech/image/upload/v1639821889/stores/store-image_ppj6ya.jpg',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Store', storeSchema)
