require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./src/config/db");
const initSocket = require("./src/socket/chatSocket");

// =========================
// CONFIG
// =========================
const PORT = process.env.PORT || 5000;

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// SERVER INIT
// =========================
const server = http.createServer(app);

// =========================
// SOCKET.IO SETUP
// =========================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize socket logic
initSocket(io);

// =========================
// START SERVER
// =========================
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});