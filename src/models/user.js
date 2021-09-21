const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
        lowercase: true
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    province: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    postalCode: {
        type: Number,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password: {
        type: String,
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Shop'
    },
    cloudinaryId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    otp: {
        code: { type: Number },
        isRight: { type: Boolean, default: false }
    }
},
    { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: function (password) {
        return bcrypt.compareSync(password, this.hash_password);
    },
};

module.exports = mongoose.model('User', userSchema);