const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password:{
        type: String,
        required: true
    },
    isSeller:{
        type: Boolean,
        default: false
    },
    shopId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Shop'
    },
    contactNumber: {
        type: String
    },
    profilePicture: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    address:{
        type: String
    },
    cloudinaryId:{
        type: String
    }
},
{timestamps: true}
);

userSchema.virtual("fullName").get(function (){
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password, this.hash_password);
    },
};

module.exports = mongoose.model('User',userSchema);