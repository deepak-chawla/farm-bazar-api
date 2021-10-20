const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
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
        enum: ["male", "female"],
        lowercase: true
    },
    profilePicture: {
        type: String,
        default: ""
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
    }
},
    { timestamps: true }
);

adminSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

adminSchema.methods = {
    authenticate: function (password) {
        return bcrypt.compareSync(password, this.hash_password);
    },
};

module.exports = mongoose.model('Admin', adminSchema);