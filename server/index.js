require("dotenv").config();

const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// create server
const server = http.createServer(app);

// start server
server.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server running on port " + PORT);
});