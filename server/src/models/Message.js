const mongoose = require("mongoose");

// =========================
// MESSAGE SCHEMA
// =========================
const messageSchema = new mongoose.Schema({
  // Room reference
  roomId: {
    type: String,
    required: true,
  },

  // Sender info
  sender: {
    type: String,
    required: true,
  },

  senderId: { type: String, required: true },

  // Message content
  text: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "text", // "text" | "audio"
  },

  audioUrl: {
    type: String,
    default: "",
  },

  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// =========================
// EXPORT MODEL
// =========================
module.exports = mongoose.model("Message", messageSchema);