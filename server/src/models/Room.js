const mongoose = require("mongoose");

// =========================
// ROOM SCHEMA
// =========================
const roomSchema = new mongoose.Schema(
  {
    // Room name
    name: {
      type: String,
      required: true,
    },

    // Members (user IDs)
    members: [
      {
        type: String, // userId
      },
    ],
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// =========================
// EXPORT MODEL
// =========================
module.exports = mongoose.model("Room", roomSchema);