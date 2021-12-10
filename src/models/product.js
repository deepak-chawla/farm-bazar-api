const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        enum: ["kg", "litre", "piece", "dozen"],
        default: "kg"
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    productPictures: [
        {
            img: { type: String },
            cloudinary_id: { type: String }
        },
    ],
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            review: String
        }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Store',
        required: true
    },
    updatedAt: Date,

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);