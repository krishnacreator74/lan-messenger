const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: String, // userId
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Room", roomSchema);