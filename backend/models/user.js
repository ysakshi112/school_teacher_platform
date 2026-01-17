const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["superadmin", "school", "teacher"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    credits: {
      type: Number,
      default: 0, // teachers start with 0 credits
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
