const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
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
