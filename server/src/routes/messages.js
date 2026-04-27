const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// =========================
// SEND MESSAGE
// =========================
router.post("/", auth, async (req, res) => {
  try {
    const { roomId, text } = req.body;

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check membership
    if (!room.members.includes(req.user.id)) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // Create message
    const message = await Message.create({
      roomId,
      text,
      sender: req.user.name,
      senderId: req.user.id,
    });

    return res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// GET MESSAGES
// =========================
router.get("/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;