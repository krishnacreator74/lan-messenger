require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./src/config/db");
const initSocket = require("./src/socket/chatSocket");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// 🔥 Socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔥 Initialize socket logic
initSocket(io);

// start server
server.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server running on port " + PORT);
});