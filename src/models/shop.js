const mongoose = require('mongoose');


const storeSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    storeName:{
        type: String,
        required: true,
    },
    about:{
        type: String
    }
},
{ timestamps: true });


module.exports = mongoose.model('Store', storeSchema);