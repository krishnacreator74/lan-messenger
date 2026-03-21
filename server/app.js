const express = require("express");
const cors = require("cors");

const roomsRoute = require("./src/routes/room");
const messagesRoute = require("./src/routes/messages");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/rooms", roomsRoute);
app.use("/messages", messagesRoute);

module.exports = app;