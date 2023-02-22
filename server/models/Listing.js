const mongoose = require('mongoose');
const {Schema} = mongoose;

const ListingSchema = new Schema({
    userId:{
        type:String,
        required: true,
    },
    title:{
        type: String,
        require: true,
    },
    image:{
        type: String,
        require: true,
    },
    address:{
        type: String,
        require: true,
    },
    dates:{
        type: String,
        require: true,
    },
    expiryDate:{
        type: Date,
        require: true,
    },
    views:{
        type: Number,
        default: 0,
    },
    price:{
        type: Number,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },

}, {timestamps:true}
);

const ListingModel = mongoose.model('Listing', ListingSchema);

module.exports = ListingModel;