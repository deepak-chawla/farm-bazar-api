const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      lowercase: true,
    },
    dateOfBirth: {
      type: String,
    },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/deetech/image/upload/w_80,h_80,c_fill/users/profile-avatar_lkpgql.jpg',
    },
    province: {
      type: String,
      trim: true,
      default: 'Sindh',
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    postalCode: {
      type: Number,
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
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    cloudinary_id: {
      type: String,
    },
  },
  { timestamps: true }
)

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password)
  },
}

module.exports = mongoose.model('User', userSchema)
