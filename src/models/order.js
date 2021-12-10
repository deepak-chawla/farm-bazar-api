const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        trim: true
    },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    orderQuantity: {
        type: Number,
        required: true,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    deliveryCharges:{
        type: Number,
        required: true,
        default: 200
    }, 
    orderAddress: {
        type: String,
        required: true,
        trim: true
    },
    orderStatus:{
        type: String,
        enum: ["pending", "inProcess", "delivered"],
        default: "pending"
    },

}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);