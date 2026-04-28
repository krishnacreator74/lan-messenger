const jwt = require("jsonwebtoken");
const Room = require("../models/Room");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // =========================
    // AUTHENTICATION
    // =========================
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        console.log("No token → disconnect");
        return socket.disconnect();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    // =========================
    // JOIN ROOM
    // =========================
    socket.on("joinRoom", async (roomId) => {
      try {
        const room = await Room.findById(roomId);

        if (!room || !room.members.includes(socket.user.id)) {
          return socket.emit("error", "Not allowed to join this room");
        }

        socket.join(roomId);
        console.log(`${socket.user.name} joined room ${roomId}`);
      } catch (err) {
        console.error("Join room error:", err);
      }
    });

    // =========================
    // SEND MESSAGE
    // =========================
    socket.on("sendMessage", async (data) => {
          try {
            // 2. Destructure EVERYTHING including type and audioUrl
            const { roomId, text, type, audioUrl } = data;

            const room = await Room.findById(roomId);
            if (!room || !room.members.includes(socket.user.id)) {
              return socket.emit("error", "Not allowed");
            }

            // 3. Prepare the full message object
            const messageData = {
              roomId,
              text: text || "",
              type: type || "text",
              audioUrl: audioUrl || "",
              sender: socket.user.name,
              senderId: socket.user.id,
              timestamp: new Date(),
            };

            // 4. SAVE TO DATABASE (Crucial so it doesn't disappear on refresh)
            const savedMessage = await Message.create(messageData);

            // 5. EMIT THE SAVED MESSAGE (use savedMessage to get the DB _id)
            io.to(roomId).emit("receiveMessage", savedMessage);

            console.log(`Message sent in ${roomId}: ${type}`);
          } catch (err) {
            console.error("Send message error:", err);
          }
        });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.name);
    });
  });
};