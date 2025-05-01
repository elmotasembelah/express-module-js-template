const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["patient", "admin", "doctor", "nurse", "accountent", "receptionist"],
      default: "patient",
    },
    _isVerified: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
