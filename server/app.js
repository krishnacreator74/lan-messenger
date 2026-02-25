const express = require("express");
const cors = require("cors");

const roomsRoute = require("./src/routes/room");
const messagesRoute = require("./src/routes/messages");

const app = express();

app.use(cors());
app.use(express.json());

console.log("roomsRoute =", typeof roomsRoute);
console.log("messagesRoute =", typeof messagesRoute);


app.use("/rooms", roomsRoute);
app.use("/", messagesRoute);

module.exports = app;
