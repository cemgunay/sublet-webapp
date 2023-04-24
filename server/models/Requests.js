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
    price: {
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
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
