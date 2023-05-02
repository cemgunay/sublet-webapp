const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestStatus = Object.freeze({
  PENDINGTENANT: "pendingTenant",
  PENDINGSUBTENANT: "pendingSubTenant",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
});

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
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      required: true,
      default: RequestStatus.PENDINGTENANT,
    },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
