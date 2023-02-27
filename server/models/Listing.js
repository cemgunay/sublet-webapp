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
    images: [{
        url: String,
        filename: String,
    }],
    address:{
        type: String,
        require: true,
    },
    city:{
        type: String,
        require: true,
    },
    moveInDate:{
        type: Date,
        require: true,
    },
    moveOutDate:{
        type: Date,
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
    propertyType:{
        type: String,
        require: true,
    },
    bedrooms: [{
        bedType: String,
        ensuite: Boolean,
    }],
    bathrooms:{
        type: Number,
        require: true,
    },
    amenities: {
        inUnitWasherAndDrier: {
            type: Boolean,
            default: false
        },
        airConditioning: {
            type: Boolean,
            default: false
        },
        petsAllowed: {
            type: Boolean,
            default: false
        },
        furnished: {
            type: Boolean,
            default: false
        },
        dishwasher: {
            type: Boolean,
            default: false
        },
        fitnessCenter: {
            type: Boolean,
            default: false
        },
        balcony: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
    },
    utilities: {
        hydro: {
            type: Boolean,
            default: false
        },
        electricity: {
            type: Boolean,
            default: false
        },
        water: {
            type: Boolean,
            default: false
        },
        wifi: {
            type: Boolean,
            default: false
        }
    },
    description:{
        type: String,
        require: true,
    },

}, {timestamps:true}
);

const ListingModel = mongoose.model('Listing', ListingSchema);

module.exports = ListingModel;