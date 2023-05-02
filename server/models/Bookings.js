const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookingSchema = new Schema(
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
    acceptedRequestId: {
      type: String,
      required: true,
    },
    acceptedPrice: {
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
    viewingDate: {
      type: Date,
    },
    depositAmount: {
        type: Number,
        required: true,
      },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;
