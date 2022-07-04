const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    character: {
      type: String,
      default: "kuma",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
