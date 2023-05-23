const mongoose = require("mongoose");
const { Schema } = mongoose;

const DocumentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Government ID', 'Sublet Agreement'],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    url: { type: String },
    originalFileName: { type: String},
    fileName: { type: String},
    timestamp: { type: Date }
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model("Document", DocumentSchema);

module.exports = DocumentModel;
