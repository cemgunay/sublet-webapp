const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phoneNumber: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    idVerified: {
      type: Boolean,
    },
    favourites: {
      type: Array,
      default: [],
    },
    occupation: {
      type: String,
    },
    drinking: {
      type: Boolean,
    },
    smoking: {
      type: Boolean,
    },
    noiseLevel: {
      type: Number,
      min: 1,
      max: 100,
    },
    instagramUrl: {
      type: String,
    },
    facebookUrl: {
      type: String,
    },
    tikTokUrl: {
      type: String,
    },
    currentTenantTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
    currentSubTenantTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    passwordChangeRequired: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
