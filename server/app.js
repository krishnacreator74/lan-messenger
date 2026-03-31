const express = require("express");
const cors = require("cors");

const roomsRoute = require("./src/routes/room");
const messagesRoute = require("./src/routes/messages");

const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Backend is alive");
});

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/rooms", roomsRoute);
app.use("/messages", messagesRoute);

module.exports = app;