const mongoose = require("mongoose");

// =========================
// CONNECT DATABASE
// =========================
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/lan_messenger");

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);

    // Exit process if DB fails
    process.exit(1);
  }
};

module.exports = connectDB;