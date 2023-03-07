const mongoose = require("mongoose");
const { Schema } = mongoose;

const bedroomSchema = new mongoose.Schema({
    bedType: [{ type: String}],
    ensuite: { type: Boolean },
  }, { _id: false });
  
const ListingSchema = new Schema(
  {
    userId: {
      type: String,
    },
    title: {
      type: String,
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    moveInDate: {
      type: Date,
    },
    moveOutDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    propertyType: {
      type: String,
    },
    bedrooms: [bedroomSchema],
    bathrooms: {
      type: Number,
    },
    amenities: {
      inUnitWasherAndDrier: {
        type: Boolean,
        default: false,
      },
      airConditioning: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
      dishwasher: {
        type: Boolean,
        default: false,
      },
      fitnessCenter: {
        type: Boolean,
        default: false,
      },
      balcony: {
        type: Boolean,
        default: false,
      },
      parking: {
        type: Boolean,
        default: false,
      },
    },
    utilities: {
      hydro: {
        type: Boolean,
        default: false,
      },
      electricity: {
        type: Boolean,
        default: false,
      },
      water: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: false,
      },
    },
    description: {
      type: String,
    },
    published: {
      type: Boolean,
    }
  },
  { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }}
);

ListingSchema.virtual('daysLeft').get(function () {
    const now = new Date();
    const diffTime = this.expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  });

const ListingModel = mongoose.model("Listing", ListingSchema);

module.exports = ListingModel;
