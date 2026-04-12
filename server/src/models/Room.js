const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
   members: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Room", roomSchema);