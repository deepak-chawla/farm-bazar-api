const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
    },
    orderQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryCharges: {
      type: Number,
      required: true,
      default: 200,
    },
    orderAddress: {
      type: String,
      required: true,
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'inProcess', 'shipped', 'completed'],
      default: 'pending',
    },
    paymentOption: {
      type: String,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
