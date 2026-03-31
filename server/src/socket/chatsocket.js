const Message = require("../models/Message");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Join a room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending message
    socket.on("send_message", async (messageData) => {
      try {
        const newMessage = new Message(messageData);
        const savedMessage = await newMessage.save();

        // Emit only to that room
        io.to(messageData.roomId).emit("receive_message", savedMessage);

        console.log("Message saved and emitted:", savedMessage);
      } catch (error) {
        console.error("Socket message error:", error);
        socket.emit("message_error", {
          error: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;