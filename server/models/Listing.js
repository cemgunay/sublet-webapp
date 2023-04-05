const mongoose = require("mongoose");
const { Schema } = mongoose;

const bedroomSchema = new mongoose.Schema(
  {
    bedType: [{ type: String }],
    ensuite: { type: Boolean },
  },
  { _id: false }
);


//NOTE:
//Dont need to use schemas for these because they are not arrays unlike bedroomSchema 
//Can remove just commented so Nino can see

/*
const basicsSchema = new mongoose.Schema(
  {
    bedrooms: [bedroomSchema],
    bathrooms: {type: Number},
  },
  { _id: false }
)

const aboutyourplaceSchema = new mongoose.Schema(
  {
    propertyType: {type: String},
    privacyType: {type: String},
  },
  { _id: false }
)

const locationSchema = new mongoose.Schema(
  {
    address1: {type: String},
    city: {type: String},
    countryregion: {type: String},
    postalcode: {type: String},
    stateprovince: {type: String},
    unitnumber: {type: String},
  },
  { _id: false }
)
*/


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
    location: {
      address1: {type: String},
      city: {type: String},
      countryregion: {type: String},
      postalcode: {type: String},
      stateprovince: {type: String},
      unitnumber: {type: String},
      lat: {type: Number},
      lng: {type: Number}
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
    aboutyourplace: {
      propertyType: {type: String},
      privacyType: {type: String}
    },
    basics: {
      bedrooms: [bedroomSchema],
      bathrooms: {type: Number}
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
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ListingSchema.virtual("daysLeft").get(function () {
  const now = new Date();
  const diffTime = this.expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

ListingSchema.virtual("numOfBedrooms").get(function () {
  return this.basics.bedrooms.length;
});

const ListingModel = mongoose.model("Listing", ListingSchema);

module.exports = ListingModel;
