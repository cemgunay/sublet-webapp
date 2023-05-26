const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
    {
      members: {
        type: Array,
      },
    },
    { timestamps: true }
  );

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = ConversationModel;