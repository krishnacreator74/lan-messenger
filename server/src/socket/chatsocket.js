const jwt = require("jsonwebtoken");
const Room = require("../models/Room");
// const Message = require("../models/Message"); // (optional if DB save madtidre)

module.exports = (io) => {
  io.on("connection", (socket) => {
    try {
      // 🔐 STEP 7 — TOKEN VERIFY
      const token = socket.handshake.auth.token;

      if (!token) {
        console.log("No token → disconnect");
        return socket.disconnect();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ attach user to socket
      socket.user = {
        id: decoded.id,
        name: decoded.name,
      };

      console.log("User connected:", socket.user.name);

    } catch (err) {
      console.log("Invalid token");
      socket.disconnect();
      return;
    }

    // ================================
    // 📌 JOIN ROOM
    // ================================
    socket.on("joinRoom", async (roomId) => {
      try {
        const room = await Room.findById(roomId);

        // 🔒 CHECK membership
        if (!room || !room.members.includes(socket.user.id)) {
          return socket.emit("error", "Not allowed to join this room");
        }

        socket.join(roomId);
        console.log(`${socket.user.name} joined room ${roomId}`);

      } catch (err) {
        console.log(err);
      }
    });

    // ================================
    // 📌 SEND MESSAGE
    // ================================
    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, text } = data;

        const room = await Room.findById(roomId);

        // 🔒 CHECK membership AGAIN (VERY IMPORTANT)
        if (!room || !room.members.includes(socket.user.id)) {
          return socket.emit("error", "Not allowed");
        }

        const message = {
          roomId,
          text,
          sender: socket.user.name,   // ✅ STEP 8 (MAIN FIX)
          senderId: socket.user.id,   // ✅ best practice
          timestamp: new Date(),
        };

        // 👉 OPTIONAL: DB save
        /*
        await Message.create(message);
        */

        io.to(roomId).emit("receiveMessage", message);

      } catch (err) {
        console.log(err);
      }
    });

    // ================================
    // 📌 DISCONNECT
    // ================================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.name);
    });
  });
};