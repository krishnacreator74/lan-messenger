const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const roomsRoute = require("./src/routes/room");
const messagesRoute = require("./src/routes/messages");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send("Backend is alive");
});

// =========================
// ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/rooms", roomsRoute);
app.use("/messages", messagesRoute);

// Static files (uploads)
app.use("/uploads", express.static("uploads"));

module.exports = app;