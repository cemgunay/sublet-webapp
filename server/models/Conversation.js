const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subTenant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    deletedByTenant: {
      type: Boolean,
      default: false,
    },
    deletedBySubtenant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = ConversationModel;
