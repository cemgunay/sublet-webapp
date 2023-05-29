const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const TokenModel = mongoose.model("Token", TokenSchema);

module.exports = TokenModel;