const mongoose = require('mongoose');


const shopSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    shopName:{
        type: String,
        required: true,
    },
    description:{
        type: String
    }
},
{ timestamps: true });


module.exports = mongoose.model('Shop', shopSchema);