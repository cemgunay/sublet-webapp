const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
    },
    subTenantId: {
      type: String,
      required: true,
    },
    listingId: {
      type: String,
      required: true,
    },
    priceOffer: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    sublettors: {
      type: Number,
      required: true,
    },
    viewingDateTime: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
