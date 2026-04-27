const mongoose = require("mongoose");

// =========================
// USER SCHEMA
// =========================
const userSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Auth
  password: {
    type: String,
    required: true,
  },
});

// =========================
// EXPORT MODEL
// =========================
module.exports = mongoose.model("User", userSchema);